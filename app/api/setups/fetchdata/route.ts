import { NextRequest, NextResponse } from "next/server";
import { drizzle } from "drizzle-orm/neon-http";
import { eq } from "drizzle-orm";
import { products } from "@/app/db/schema";

const db = drizzle(process.env.DATABASE_URL!);

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email");

  if (!email) {
    return NextResponse.json(
      { message: "Email is required" },
      { status: 400 }
    );
  }

  try {
    const response = await db
      .select()
      .from(products)
      .where(eq(products.email, email));

    return NextResponse.json(
      { message: "success", data: response },
      { status: 200 }
    );
  } catch (err: unknown) {
    console.error("Error found:", err);
    return NextResponse.json(
      { message: "Server Error" },
      { status: 500 }
    );
  }
}
