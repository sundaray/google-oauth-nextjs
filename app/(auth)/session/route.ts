import { NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/get-current-session";

export async function GET() {
  try {
    const { user } = await getCurrentSession();

    return NextResponse.json({ user });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch session" },
      { status: 500 },
    );
  }
}
