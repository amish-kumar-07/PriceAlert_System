// db/scripts/setupContextFrequencyTrigger.ts
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { sql } from 'drizzle-orm';

const db = drizzle(neon(process.env.DATABASE_URL!));

export async function POST() {
  try {
    // 1. Create or replace the function
    await db.execute(sql`
      CREATE OR REPLACE FUNCTION update_notification_frequency()
      RETURNS TRIGGER AS $$
      BEGIN
        UPDATE notification_settings
        SET frequency = NEW.frequency
        WHERE email = NEW.email;

        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `);

    console.log("✅ Frequency update function created.");

    // 2. Drop existing trigger (if any)
    await db.execute(sql.raw(`
      DROP TRIGGER IF EXISTS context_frequency_trigger ON public.context;
    `));

    console.log("✅ Old frequency trigger dropped.");

    // 3. Create new trigger on frequency update
    await db.execute(sql.raw(`
      CREATE TRIGGER context_frequency_trigger
      AFTER UPDATE OF frequency
      ON public.context
      FOR EACH ROW
      WHEN (
        OLD.frequency IS DISTINCT FROM NEW.frequency
      )
      EXECUTE FUNCTION update_notification_frequency();
    `));

    console.log("✅ Frequency trigger created successfully.");

    return new Response(JSON.stringify({ success: true, message: "Frequency trigger created." }), { status: 200 });

  } catch (err) {
    console.error("❌ Error creating context frequency trigger:", err);
    return new Response(JSON.stringify({ success: false, error: (err as Error).message }), { status: 500 });
  }
}
