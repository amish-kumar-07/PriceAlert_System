// app/api/setups/updatestatus/route.ts
import { NextRequest, NextResponse } from "next/server";
import { drizzle } from "drizzle-orm/neon-http";
import { eq, and } from "drizzle-orm";
import { products } from "@/app/db/schema"; // or whatever table you're updating

const db = drizzle(process.env.DATABASE_URL!);

export async function PATCH(request: NextRequest) {
  try {
    const { asin, email, status } = await request.json();

    if (!asin || !email || typeof status !== "boolean") {
      return NextResponse.json({ success: false, message: "Missing or invalid parameters." }, { status: 400 });
    }

    const result = await db
      .update(products)
      .set({ status }) // 👈 change the boolean field
      .where(and(eq(products.asin, asin), eq(products.email, email)));

    return NextResponse.json({ success: true, message: "Status updated", result }, { status: 200 });
  } catch (error) {
    console.error("Status update error:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
