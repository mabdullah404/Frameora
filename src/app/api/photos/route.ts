import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

// In-memory fallback if MongoDB has temporary connection issues
let fallbackPhotos: any[] = [];

async function saveBase64ImageToServer(base64Data: string, title: string): Promise<string> {
  const matches = base64Data.match(/^data:image\/([a-zA-Z+]+);base64,(.+)$/);
  if (!matches) {
    return base64Data; // Return as-is if not standard base64 data url
  }

  const ext = `.${matches[1] === "jpeg" ? "jpg" : matches[1]}`;
  const fileBuffer = Buffer.from(matches[2], "base64");
  const safeName = title.replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 30);
  const fileName = `${Date.now()}-${safeName}${ext}`;

  const uploadDir = path.join(process.cwd(), "public", "uploads");
  await mkdir(uploadDir, { recursive: true });

  const filePath = path.join(uploadDir, fileName);
  await writeFile(filePath, fileBuffer);

  return `/uploads/${fileName}`;
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const uploaderEmail = searchParams.get("uploaderEmail");
    const uploaderId = searchParams.get("uploaderId");
    const includePrivate = searchParams.get("includePrivate") === "true";

    const db = await getDatabase();

    let query: any = {};

    if (uploaderEmail || uploaderId) {
      // Query specific user's uploads (can include their private photos)
      const uploaderConditions: any[] = [];
      if (uploaderEmail) uploaderConditions.push({ uploaderEmail: uploaderEmail.toLowerCase().trim() });
      if (uploaderId) uploaderConditions.push({ uploaderId });

      if (includePrivate) {
        query = { $or: uploaderConditions };
      } else {
        query = {
          $and: [
            { $or: uploaderConditions },
            { $or: [{ isPrivate: false }, { isPrivate: { $exists: false } }, { isPrivate: null }] },
          ],
        };
      }
    } else {
      // Public explore gallery: strictly public photos only!
      query = {
        $or: [
          { isPrivate: false },
          { isPrivate: { $exists: false } },
          { isPrivate: null },
        ],
      };
    }

    const uploadedPhotos = await db
      .collection("photos")
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();

    const formattedDbPhotos = uploadedPhotos.map((p) => ({
      ...p,
      id: p._id?.toString() || p.id,
      isPrivate: Boolean(p.isPrivate),
    }));

    return NextResponse.json({
      success: true,
      photos: formattedDbPhotos,
    });
  } catch (error: any) {
    console.warn("MongoDB fetch warning (serving fallback photos):", error.message);
    return NextResponse.json({
      success: true,
      photos: fallbackPhotos,
    });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      title,
      category,
      image,
      photographer,
      location,
      description,
      uploaderId,
      uploaderEmail,
      isPrivate,
    } = body;

    if (!title || !image) {
      return NextResponse.json(
        { success: false, message: "Title and Image are required" },
        { status: 400 }
      );
    }

    // Attempt saving to server filesystem (/public/uploads) if base64 Data URL,
    // otherwise fallback gracefully to preserving base64 URL directly in MongoDB
    let serverImageUrl = image;
    if (typeof image === "string" && image.startsWith("data:image/")) {
      try {
        serverImageUrl = await saveBase64ImageToServer(image, title);
      } catch (fsErr) {
        console.warn("Filesystem write not available (e.g. Vercel serverless), retaining direct data URL:", fsErr);
        serverImageUrl = image;
      }
    }

    const newPhoto = {
      title,
      category: category || "Nature",
      folder: category || "Nature",
      image: serverImageUrl,
      photographer: photographer || "Abdullah",
      location: location || "Bangladesh",
      description: description || "",
      uploaderId: uploaderId || "user-abdullah",
      uploaderEmail: uploaderEmail ? uploaderEmail.toLowerCase().trim() : "",
      isPrivate: Boolean(isPrivate),
      likesCount: 0,
      likedBy: [],
      createdAt: new Date(),
    };

    try {
      const db = await getDatabase();
      const result = await db.collection("photos").insertOne(newPhoto);

      // Record activity log
      await db.collection("activity_logs").insertOne({
        action: "PHOTO_UPLOAD",
        detail: `Uploaded frame '${title}' (${isPrivate ? "Private" : "Public"}) in category ${category}`,
        user: photographer || uploaderEmail || "Member",
        createdAt: new Date(),
      });

      return NextResponse.json({
        success: true,
        photo: { ...newPhoto, id: result.insertedId.toString() },
      });
    } catch (dbErr: any) {
      console.warn("MongoDB write fallback:", dbErr.message);
      const fallbackId = `photo-${Date.now()}`;
      const savedPhoto = { ...newPhoto, id: fallbackId };
      fallbackPhotos.unshift(savedPhoto);

      return NextResponse.json({
        success: true,
        photo: savedPhoto,
        warning: "Saved to local server storage",
      });
    }
  } catch (error: any) {
    console.error("Photo upload error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, isPrivate, title, description } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Photo ID required" },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const { ObjectId } = await import("mongodb");

    let filter: any = { id };
    if (ObjectId.isValid(id)) {
      filter = { $or: [{ _id: new ObjectId(id) }, { id }] };
    }

    const updateFields: any = { updatedAt: new Date() };
    if (typeof isPrivate === "boolean") updateFields.isPrivate = isPrivate;
    if (typeof title === "string" && title.trim()) updateFields.title = title.trim();
    if (typeof description === "string") updateFields.description = description.trim();

    await db.collection("photos").updateOne(filter, { $set: updateFields });

    return NextResponse.json({
      success: true,
      message: "Photo updated successfully",
      isPrivate,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, message: "Photo ID required" }, { status: 400 });
    }

    fallbackPhotos = fallbackPhotos.filter((p) => p.id !== id);

    try {
      const db = await getDatabase();
      const { ObjectId } = await import("mongodb");

      let filter: any = { id };
      if (ObjectId.isValid(id)) {
        filter = { $or: [{ _id: new ObjectId(id) }, { id }] };
      }

      await db.collection("photos").deleteOne(filter);
    } catch (dbErr) {
      console.warn("MongoDB delete fallback:", dbErr);
    }

    return NextResponse.json({ success: true, message: "Photo removed" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
