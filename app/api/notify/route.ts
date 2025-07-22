import { NextRequest, NextResponse } from "next/server";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { notificationSettings } from "@/app/db/schema";

// Initialize Drizzle with Neon
const db = drizzle(neon(process.env.DATABASE_URL!));

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      email,
      asin,
      frequency = 3,
      status = true,
      currentPrice,
      userId,
    } = body;

    if (!email || !asin || currentPrice === undefined) {
      return NextResponse.json(
        { success: false, message: "Missing required fields (email, asin, currentPrice)" },
        { status: 400 }
      );
    }

    const res = await db.insert(notificationSettings).values({
      email,
      asin,
      frequency,
      status,
      currentPrice,
      userId,
    }).returning();

    return NextResponse.json({
      success: true,
      message: "Notification added successfully",
      data: res[0],
    });
  } catch (err) {
    console.error("Error adding notification:", err);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
