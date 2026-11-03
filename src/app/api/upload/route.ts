import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type") || "";
    let fileName = "";
    let fileBuffer: Buffer | null = null;

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const file = formData.get("file") as File | null;

      if (!file) {
        return NextResponse.json(
          { success: false, message: "No file provided in form data" },
          { status: 400 }
        );
      }

      const bytes = await file.arrayBuffer();
      fileBuffer = Buffer.from(bytes);

      // Clean file extension and name
      const ext = path.extname(file.name) || ".jpg";
      const sanitizedBase = path
        .basename(file.name, ext)
        .replace(/[^a-zA-Z0-9_-]/g, "_")
        .slice(0, 30);
      fileName = `${Date.now()}-${sanitizedBase}${ext}`;
    } else {
      // JSON payload containing base64 data URL
      const body = await req.json();
      const { image, name } = body;

      if (!image) {
        return NextResponse.json(
          { success: false, message: "No image payload provided" },
          { status: 400 }
        );
      }

      // Format: data:image/png;base64,iVBORw0KGgo...
      const matches = image.match(/^data:image\/([a-zA-Z+]+);base64,(.+)$/);
      if (!matches) {
        return NextResponse.json(
          { success: false, message: "Invalid base64 image data" },
          { status: 400 }
        );
      }

      const ext = `.${matches[1] === "jpeg" ? "jpg" : matches[1]}`;
      fileBuffer = Buffer.from(matches[2], "base64");
      const safeName = (name || "upload").replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 30);
      fileName = `${Date.now()}-${safeName}${ext}`;
    }

    if (!fileBuffer) {
      return NextResponse.json(
        { success: false, message: "Failed to read file buffer" },
        { status: 400 }
      );
    }

    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });

    const filePath = path.join(uploadDir, fileName);
    await writeFile(filePath, fileBuffer);

    const publicUrl = `/uploads/${fileName}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      fileName,
    });
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to upload file" },
      { status: 500 }
    );
  }
}
