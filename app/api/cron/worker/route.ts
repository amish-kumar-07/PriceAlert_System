import { Worker, Queue } from "bullmq";
import { Redis } from "ioredis";
import { NextResponse } from "next/server";
import dotenv from "dotenv";

dotenv.config();

// ✅ Use the actual Redis connection variable
const redis = new Redis(process.env.REDIS_URL!);

// 🔁 Clean price utility
function cleanPrice(price: string | number): number {
  if (typeof price === "number") return price;
  if (!price || price.trim() === "") return 0;

  let cleanedCash = price.replace(/[\p{Sc},]/gu, "").trim();
  return parseInt(cleanedCash.replace(/,/g, ""));
}

const myMap = new Map();
const API = process.env.API_KEY;

// ✅ Use correct connection variable
const jobQueue = new Queue("jobs", { connection: redis });
const emailQueue = new Queue("email", { connection: redis });

redis.ping().then(res => console.log("Redis PING:", res)); // should log: PONG

export async function GET() {
  try {
    await new Promise<void>((resolve, reject) => {
      const worker = new Worker(
        "jobs",
        async job => {
          const { asin, currentPrice, lastUpdated, frequency, email } = job.data;
          console.log("🔔 Job data received:", job.data);

          try {
            const response = await fetch(
              `https://api.scraperapi.com?api_key=${API}&url=https://www.amazon.in/dp/${asin}&autoparse=true&country_code=in`,
              {
                method: "GET",
                headers: { "Content-Type": "application/json" },
              }
            );

            const data = await response.json();
            const newPrice = cleanPrice(data?.pricing);
            let finalCurrentPrice = cleanPrice(currentPrice);

            if (!finalCurrentPrice || finalCurrentPrice === 0) {
              finalCurrentPrice = newPrice;
              console.warn(`⚠️ No valid currentPrice for ASIN ${asin}, using newPrice as fallback.`);
            }

            let status: "same" | "increased" | "decreased" = "same";
            if (newPrice > finalCurrentPrice) status = "increased";
            else if (newPrice < finalCurrentPrice) status = "decreased";

            const changed = newPrice !== finalCurrentPrice;

            console.log(`💰 ${asin} ➜ Old: ${finalCurrentPrice}, New: ${newPrice}, Status: ${status}`);

            myMap.set(asin, {
              oldPrice: finalCurrentPrice,
              newPrice,
              changed,
              status,
            });

            // ✅ Check email timing
            if (lastUpdated && frequency) {
              const diffMs = Date.now() - new Date(lastUpdated).getTime();
              const hourDiff = diffMs / (1000 * 60 * 60);

              if (hourDiff >= frequency) {
                console.log(`📧 YES – ${frequency}hr mark hit for ASIN ${asin}. Send email to ${email}`);
                await emailQueue.add("send-email", {
                  asin,
                  email,
                  newPrice,
                  oldPrice: finalCurrentPrice,
                  status,
                  lastUpdated,
                  frequency,
                });
              } else {
                console.log(`⏳ WAIT – Only ${hourDiff.toFixed(2)}hr passed for ASIN ${asin}, not sending email`);
              }
            }
          } catch (err: any) {
            console.error("❌ Error processing job:", err.message);
            throw new Error("Price check failed for ASIN: " + asin);
          }
        },
        {
          connection: redis,
          concurrency: 1,
        }
      );

      // 🛑 Graceful shutdown
      worker.on("completed", async () => {
        const waiting = await jobQueue.getWaiting();
        const active = await jobQueue.getActive();

        if (waiting.length === 0 && active.length === 0) {
          await worker.close();
          resolve();
        }
      });

      worker.on("failed", async (_job, err) => {
        await worker.close();
        reject(err);
      });
    });

    return NextResponse.json(
      {
        message: "✅ All jobs processed",
        data: Object.fromEntries(myMap),
      },
      { status: 200 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { error: "❌ Job processing failed", message: err.message },
      { status: 500 }
    );
  }
}
