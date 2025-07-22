import { Worker, Queue } from "bullmq";
import { NextResponse } from "next/server";
import {  buildMail, sendEmail, verifySmtp } from "@/lib/mailer";
import { Redis } from "ioredis";
import dotenv from "dotenv";

dotenv.config();

const redis = new Redis(process.env.REDIS_URL!);

let arr: {
  asin: string;
  email: string;
  newPrice: number;
  oldPrice: number;
  status: "same" | "decreased" | "increased";
  success?: boolean;
  error?: string;
}[] = [];

export async function GET() {
  try {
    console.log("🚀 Starting email worker...");

    // Verify SMTP connection at runtime
    await verifySmtp();

    const emailQueue = new Queue("email", { connection: redis });

    const emailWorker = new Worker(
      "email",
      async job => {
        const { asin, email, newPrice, oldPrice, status } = job.data;
        console.log("📧 Processing job:", job.data);

        try {
          const mailOptions = buildMail({ asin, email, newPrice, oldPrice, status });
          const result = await sendEmail(mailOptions);

          // Optionally update price history
          try {
            await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/price-history`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                asin,
                currentPrice: newPrice,
                originalPrice: oldPrice,
                platform: "amazon",
              }),
            });
            console.log("📦 Price history sent to /api/price-history");
          } catch (apiError: any) {
            console.error("❌ Failed to send price history to endpoint:", apiError);
          }

          arr.push({ asin, email, newPrice, oldPrice, status, success: true });
          console.log(`✅ Email sent successfully to ${email} for ASIN ${asin}`, result.messageId);
        } catch (error: any) {
          console.error(`❌ Failed to send email to ${email} for ASIN ${asin}:`, error);
          arr.push({ asin, email, newPrice, oldPrice, status, success: false, error: error.message });
        }
      },
      {
        connection: redis,
        concurrency: 2,
      }
    );

    // Handle worker events
    emailWorker.on("completed", job => {
      console.log(`🏁 Job ${job.id} completed`);
    });

    emailWorker.on("failed", (job, err) => {
      console.error(`💥 Job ${job?.id} failed:`, err);
    });

    // Gracefully shut down worker when queue is empty
    await new Promise<void>((resolve) => {
      const checkAndClose = async () => {
        const waiting = await emailQueue.getWaiting();
        const active = await emailQueue.getActive();

        console.log(`📊 Queue status - Waiting: ${waiting.length}, Active: ${active.length}`);
        if (waiting.length === 0 && active.length === 0) {
          console.log("🔚 All jobs completed, closing worker");
          await emailWorker.close();
          resolve();
        }
      };

      emailWorker.on("completed", checkAndClose);

      setTimeout(checkAndClose, 1000); // Fallback check
    });

    return NextResponse.json({
      message: "✅ Emails processed",
      data: arr,
      summary: {
        total: arr.length,
        successful: arr.filter(item => item.success).length,
        failed: arr.filter(item => !item.success).length,
      },
    });
  } catch (error: any) {
    console.error("❌ Email worker error:", error);
    return NextResponse.json(
      { error: "❌ Email processing failed", message: error.message },
      { status: 500 }
    );
  }
}
