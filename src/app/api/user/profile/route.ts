import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { ObjectId } from "mongodb";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    let email = searchParams.get("email");

    // Check server session if email param not provided
    if (!email) {
      const session = await auth.api.getSession({
        headers: await headers(),
      });
      if (session?.user?.email) {
        email = session.user.email;
      }
    }

    if (!email) {
      return NextResponse.json(
        { success: false, message: "User email parameter required" },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();
    const db = await getDatabase();

    // Query user in Better Auth user collection
    const userDoc = await db.collection("user").findOne({
      email: cleanEmail,
    });

    // Also look up profile collection for extended info
    const profileDoc = await db.collection("user_profiles").findOne({
      email: cleanEmail,
    });

    const merged = {
      id: userDoc?._id?.toString() || profileDoc?._id?.toString() || "",
      name: profileDoc?.name || userDoc?.name || "Member",
      email: cleanEmail,
      username: profileDoc?.username || cleanEmail.split("@")[0],
      avatar: profileDoc?.avatar !== undefined ? profileDoc.avatar : (userDoc?.image || ""),
      bio: profileDoc?.bio || "",
      // Personal Info (Optional)
      phone: profileDoc?.phone || "",
      bloodGroup: profileDoc?.bloodGroup || "",
      dob: profileDoc?.dob || "",
      gender: profileDoc?.gender || "",
      location: profileDoc?.location || "",
      // Photography Info (Optional)
      photographerName: profileDoc?.photographerName || "",
      experience: profileDoc?.experience || "",
      favoriteCategory: profileDoc?.favoriteCategory || "",
      website: profileDoc?.website || "",
      facebook: profileDoc?.facebook || "",
      instagram: profileDoc?.instagram || "",
      linkedin: profileDoc?.linkedin || "",
    };

    return NextResponse.json({
      success: true,
      profile: merged,
    });
  } catch (error: any) {
    console.error("Profile GET error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      email,
      name,
      username,
      avatar,
      bio,
      phone,
      bloodGroup,
      dob,
      gender,
      location,
      photographerName,
      experience,
      favoriteCategory,
      website,
      facebook,
      instagram,
      linkedin,
    } = body;

    if (!email) {
      return NextResponse.json(
        { success: false, message: "User email is required" },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();
    const db = await getDatabase();

    const profileData = {
      email: cleanEmail,
      name: name?.trim() || "Member",
      username: username?.trim() || cleanEmail.split("@")[0],
      avatar: avatar !== undefined ? avatar : "",
      bio: bio?.trim() || "",
      phone: phone?.trim() || "",
      bloodGroup: bloodGroup?.trim() || "",
      dob: dob?.trim() || "",
      gender: gender?.trim() || "",
      location: location?.trim() || "",
      photographerName: photographerName?.trim() || "",
      experience: experience?.trim() || "",
      favoriteCategory: favoriteCategory?.trim() || "",
      website: website?.trim() || "",
      facebook: facebook?.trim() || "",
      instagram: instagram?.trim() || "",
      linkedin: linkedin?.trim() || "",
      updatedAt: new Date(),
    };

    // Upsert into user_profiles collection
    await db.collection("user_profiles").updateOne(
      { email: cleanEmail },
      { $set: profileData },
      { upsert: true }
    );

    // Also update Better Auth user collection so image and name reflect across the system
    const userUpdate: any = { updatedAt: new Date() };
    if (name) userUpdate.name = name.trim();
    if (avatar !== undefined) userUpdate.image = avatar;

    await db.collection("user").updateOne(
      { email: cleanEmail },
      { $set: userUpdate }
    );

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully",
      profile: profileData,
    });
  } catch (error: any) {
    console.error("Profile POST error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
