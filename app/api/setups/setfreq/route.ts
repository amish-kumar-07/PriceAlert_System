import { NextRequest, NextResponse } from 'next/server';
import { drizzle } from 'drizzle-orm/neon-http';
import { context } from '@/app/db/schema';
import { eq } from 'drizzle-orm';

const db = drizzle(process.env.DATABASE_URL!);

export async function POST(request: NextRequest) {
  try {
    const res = await request.json();
    const { freq, email } = res;

    if (typeof freq !== 'number' || typeof email !== 'string') {
      return NextResponse.json({ message: 'Missing or invalid field' }, { status: 400 });
    }

    const updated = await db
      .update(context)
      .set({ frequency: freq }) // ✅ Set frequency value here
      .where(eq(context.email, email))
      .returning(); // optional: returns updated row(s)

    if (updated.length === 0) {
      return NextResponse.json({ message: 'User not found or nothing changed' }, { status: 404 });
    }

    return NextResponse.json(
      { message: 'Frequency updated', user: updated[0] },
      { status: 200 }
    );
  } catch (err) {
    console.error('Error updating frequency:', err);
    return NextResponse.json({ message: 'Server Error' }, { status: 500 });
  }
}
