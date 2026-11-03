import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || "mabdullah539629@gmail.com").toLowerCase().trim();

export async function GET(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user || !session.user.email) {
      return NextResponse.json(
        { authorized: false, error: "Unauthorized. Please sign in." },
        { status: 401 }
      );
    }

    const email = session.user.email.toLowerCase().trim();
    if (email !== ADMIN_EMAIL) {
      return NextResponse.json(
        { authorized: false, error: "Access Denied. Admin privileges required." },
        { status: 403 }
      );
    }

    return NextResponse.json({
      authorized: true,
      user: {
        name: session.user.name,
        email: session.user.email,
        role: "admin",
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { authorized: false, error: error.message },
      { status: 500 }
    );
  }
}
