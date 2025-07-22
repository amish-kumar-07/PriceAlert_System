import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { sql } from 'drizzle-orm';

const db = drizzle(neon(process.env.DATABASE_URL!));

export async function POST() {
  try {
    // 1. Create the update function
    await db.execute(sql`
      CREATE OR REPLACE FUNCTION update_notification_settings()
      RETURNS TRIGGER AS $$
      BEGIN
        UPDATE notification_settings
        SET
          current_price = NEW.current_price,
          status = NEW.status,
          last_updated = NOW()
        WHERE asin = NEW.asin;

        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `);

    console.log("✅ Function created.");

    // 2. Drop existing trigger (if any)
    await db.execute(sql.raw(`
      DROP TRIGGER IF EXISTS product_update_trigger ON public.products;
    `));

    console.log("✅ Old trigger dropped (if it existed).");

    // 3. Create the trigger on products table
    await db.execute(sql.raw(`
      CREATE TRIGGER product_update_trigger
      AFTER UPDATE OF current_price, status
      ON public.products
      FOR EACH ROW
      WHEN (
        OLD.current_price IS DISTINCT FROM NEW.current_price OR
        OLD.status IS DISTINCT FROM NEW.status
      )
      EXECUTE FUNCTION update_notification_settings();
    `));

    console.log("✅ Trigger created.");

    return new Response(JSON.stringify({
      success: true,
      message: "✅ Trigger created and will sync price/status by asin."
    }), { status: 200 });

  } catch (err) {
    console.error("❌ Error during trigger setup:", err);
    return new Response(JSON.stringify({
      success: false,
      error: (err as Error).message
    }), { status: 500 });
  }
}
