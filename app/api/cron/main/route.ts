import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { notificationSettings } from "@/app/db/schema";
import { Queue } from "bullmq";
import { NextResponse } from "next/server";
import { Redis } from "ioredis";
import dotenv from "dotenv";

dotenv.config();

// ✅ Connect to Redis using REDIS_URL
const redis = new Redis(process.env.REDIS_URL!);

const db = drizzle(neon(process.env.DATABASE_URL!));
const notifications = new Queue("jobs",{ connection: redis });

export async function GET() {
  const start = Date.now();

  try {
    const jobs = await db.select().from(notificationSettings);

    if (jobs.length === 0) {
      return new Response(
        JSON.stringify({ message: "No products to check" }),
        { status: 200 }
      );
    }

    jobs.forEach(job => {
      if (job.status) {
        notifications.add("jobs", {
          asin: job.asin,
          email: job.email,
          currentPrice: job.currentPrice,
          lastUpdated: job.lastUpdated,  
          frequency: job.frequency,
        });
      }
    });


    return NextResponse.json(
      { message: "The jobs are in queue", data: jobs },
      { status: 200 }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({
        error: "GET check failed",
        message: err.message,
      }),
      { status: 500 }
    );
  }
}
