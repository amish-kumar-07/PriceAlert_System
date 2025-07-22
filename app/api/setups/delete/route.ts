import { NextRequest, NextResponse } from "next/server";
import { drizzle } from "drizzle-orm/neon-http";
import { and, eq } from "drizzle-orm";
import { products } from "@/app/db/schema";

const db = drizzle(process.env.DATABASE_URL!);

export async function DELETE(request: NextRequest) {
  try {
    const { asin, url } = await request.json();

    if (!asin || !url) {
      return NextResponse.json(
        { message: "asin and url are required." },
        { status: 400 }
      );
    }

    const result = await db
      .delete(products)
      .where(and(eq(products.asin, asin), eq(products.url, url)))
      .returning(); // optional but useful

    console.log(result.length);  
    if (result.length < 0) {
      return NextResponse.json({
        success: true,
        message: "Row has been deleted from the database"
        }, { status: 200 });
    }

    return NextResponse.json(
      { success: true, message: "Row has been deleted from the database", deleted: result },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error found in DELETE route:", err);
    return NextResponse.json(
      { message: "Something went wrong on the server." },
      { status: 500 }
    );
  }
}
