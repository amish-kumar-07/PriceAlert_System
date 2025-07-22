import { NextRequest, NextResponse } from 'next/server';
import { drizzle } from 'drizzle-orm/neon-http';
import { eq, and } from 'drizzle-orm';
import { context } from '@/app/db/schema';

interface RequestBody {
  email: string;
  user_id: number;
  name: string;
}

const db = drizzle(process.env.DATABASE_URL!);

export async function POST(request: NextRequest) {
  try {
    const body: RequestBody = await request.json();
    const { email, user_id, name } = body;

    if (
      typeof email !== 'string' ||
      typeof user_id !== 'number' ||
      typeof name !== 'string'
    ) {
      return NextResponse.json(
        { message: 'Invalid input types' },
        { status: 400 }
      );
    }

    let existingUser = await db
      .select()
      .from(context)
      .where(and(eq(context.email, email), eq(context.userId, user_id)))
      .limit(1);

    if (existingUser.length === 0) {
      const insertedUser = await db
        .insert(context)
        .values({
          userId: user_id,
          email: email,
          name: name,
          frequency: 3,
        })
        .returning();

      existingUser = insertedUser;
    }

    const user = existingUser[0];

    return NextResponse.json(
      {
        message: 'Login successful',
        user: {
          id: user.userId,
          email: user.email,
          name: user.name,
          frequency: user.frequency,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
