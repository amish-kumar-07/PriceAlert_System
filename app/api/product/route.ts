import { NextRequest, NextResponse } from "next/server";
import { drizzle } from "drizzle-orm/neon-http";
import { and, eq } from "drizzle-orm";
import { products } from "@/app/db/schema";

const db = drizzle(process.env.DATABASE_URL!); // ideally reuse this elsewhere

function cleanPrice(price: string | number): number {
  if (typeof price === "number") return price;
  
  if (!price || price === "") return 0;
  
  let cleanedCash = price.replace(/[\p{Sc},]/gu, "").trim();
  let ans = "";
  for (let i = 0; i < cleanedCash.length; i++) {
    if (cleanedCash[i] != ',') {
      ans += cleanedCash[i];
    }
  }

  return parseInt(ans);
}


export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      email, name, url, image, asin,
      platform, platformProductId,
      currentPrice, originalPrice,
      priceString, stars, totalReviews,
      hasPrime, isBestSeller,
      isAmazonChoice, isFkAssured,
    } = body;

    console.log(asin);
    // TODO: validate body here
    const original_price_num = cleanPrice(originalPrice);
    const current_price_num = cleanPrice(currentPrice);

    const existing = await db
      .select()
      .from(products)
      .where(and(eq(products.url, url), eq(products.platformProductId, platformProductId)))
      .limit(1);

    if (existing.length > 0) {
      // Update existing product with new price information
      const updatedProduct = await db
        .update(products)
        .set({
          currentPrice: current_price_num.toString(),
          originalPrice: original_price_num.toString(),
          priceString,
          stars: stars?.toString(),
          totalReviews,
          hasPrime,
          isBestSeller,
          isAmazonChoice,
          isFkAssured,
          lastUpdated: new Date(),
        })
        .where(eq(products.productId, existing[0].productId))
        .returning();

      return NextResponse.json(
        { message: "Product updated successfully", data: updatedProduct[0] },
        { status: 200 },
      );
    }

    const res = await db.insert(products).values({
      // Remove email if it doesn't exist in schema, or add it if it should
      email, // <-- Remove this line if email field doesn't exist in products schema
      name,
      url,
      image,
      asin,
      platform,
      platformProductId,
      currentPrice: current_price_num?.toString(),
      originalPrice: original_price_num.toString(), // Convert to string
      priceString,
      stars: stars?.toString(),
      totalReviews,
      hasPrime,
      isBestSeller,
      isAmazonChoice,
      isFkAssured,
    }).returning();

    return NextResponse.json(
      { message: "Product added successfully", data: res[0] },
      { status: 201 },
    );
  } catch (error) {
    console.error("add‑product error:", error);
    return NextResponse.json(
      { message: "Failed to add product" },
      { status: 500 },
    );
  }
}