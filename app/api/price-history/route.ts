// app/api/price-history/route.ts
import { NextRequest, NextResponse } from "next/server";
import { priceHistory } from "@/app/db/schema"; // import the table
import { drizzle } from 'drizzle-orm/neon-http';


const db = drizzle(process.env.DATABASE_URL!);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      userId,
      userEmail,
      asin,
      currentPrice,
      originalPrice,
      platform, // optional
    } = body;
    
    if (!asin || !currentPrice) {
      return NextResponse.json(
        { error: "ASIN and currentPrice are required." },
        { status: 400 }
      );
    }

    const inserted = await db.insert(priceHistory).values({
      asin,
      email : userEmail,
      currentPrice,
      originalPrice,
      platform,
      userId : userId,
    });

    return NextResponse.json({ message: "Price history recorded", inserted }, { status: 201 });
  } catch (error) {
    console.error("[PRICE_HISTORY_POST_ERROR]", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
