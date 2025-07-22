import { NextRequest, NextResponse } from "next/server";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless"; // ✅ Required for neon-http
import { eq, desc } from "drizzle-orm";
import { priceHistory } from "@/app/db/schema"; // ✅ Adjust if needed

// 🔑 Create neon fetch client first
const sql = neon(process.env.DATABASE_URL!);

// ✅ Pass it to drizzle
const db = drizzle(sql);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email } = body;

    if (!email) {
      return new NextResponse("Email is required", { status: 400 });
    }

    const result = await db
      .select()
      .from(priceHistory)
      .where(eq(priceHistory.email, email))
      .orderBy(desc(priceHistory.trackedAt));

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching price history:", error);
    return new NextResponse("Failed to fetch price history", { status: 500 });
  }
}

export async function GET() {
  return new NextResponse("Method Not Allowed", { status: 405 });
}
