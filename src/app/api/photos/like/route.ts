import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";

export async function POST(req: NextRequest) {
  try {
    const { photoId, userId } = await req.json();

    if (!photoId) {
      return NextResponse.json({ success: false, message: "photoId required" }, { status: 400 });
    }

    const db = await getDatabase();
    const collection = db.collection("photos");
    const { ObjectId } = await import("mongodb");

    let query: any = { id: photoId };
    if (ObjectId.isValid(photoId)) {
      query = { $or: [{ _id: new ObjectId(photoId) }, { id: photoId }] };
    }

    const existing = await collection.findOne(query);

    if (existing) {
      const alreadyLiked = existing.likedBy?.includes(userId);
      const update = alreadyLiked
        ? {
            $pull: { likedBy: userId },
            $inc: { likesCount: -1 },
          }
        : {
            $addToSet: { likedBy: userId },
            $inc: { likesCount: 1 },
          };

      await collection.updateOne(query, update);
      return NextResponse.json({ success: true, liked: !alreadyLiked });
    }

    return NextResponse.json({ success: true, note: "Local photo liked" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
