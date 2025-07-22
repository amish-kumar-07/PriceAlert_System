import { NextRequest, NextResponse } from "next/server";
const API = process.env.API_KEY;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { item } = body;

    if (!item) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const url = `https://api.scraperapi.com/?api_key=${API}&url=https://www.amazon.in/s?k=${encodeURIComponent(item)}&render=true&autoparse=true`;

    const res = await fetch(url, {
      method: "GET",
      headers: {
        'Content-Type': 'application/json',
      }
    });

    const result = await res.json();

    const products = (result.results || []).filter((item: any) => item.type === "search_product");

    // Cleaned & filtered data
    const cleaned = products
      .map((p: any) => ({
        asin: p.asin,
        name: p.name,
        image: p.image,
        stars: p.stars,
        total_reviews: p.total_reviews,
        url: p.url,
        price: p.price,
        price_string: p.price_string,
        original_price: p.original_price?.price_string,
        has_prime: p.has_prime,
        is_best_seller: p.is_best_seller,
        is_amazon_choice: p.is_amazon_choice,
      }))
      .filter((p: any) =>
        // Keep only items that contain the exact item keyword (case insensitive)
        p.name?.toLowerCase().includes(item.toLowerCase())
      );

    // Remove duplicate ASINs
    const uniqueProducts = cleaned.filter(
      (product : any, index : any , self : any) =>
        index === self.findIndex((p: { asin: any; }) => p.asin === product.asin)
    );

    // Limit to 8 products
    const limitedProducts = uniqueProducts.slice(0, 8);

    return NextResponse.json({ success: true, products: limitedProducts }, { status: 200 });
  } catch (e) {
    return NextResponse.json({ success: false, message: String(e) }, { status: 500 });
  }
}
