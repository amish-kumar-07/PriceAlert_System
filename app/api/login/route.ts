import { NextRequest, NextResponse } from 'next/server';
import { drizzle } from 'drizzle-orm/neon-http';
import { eq } from 'drizzle-orm';
import { users } from '@/app/db/schema';
import bcrypt from 'bcryptjs';

const db = drizzle(process.env.DATABASE_URL!);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const existingUser = await db.select().from(users).where(eq(users.email, email));

    if (existingUser.length === 0) {
      return NextResponse.json({ message: 'No user found' }, { status: 404 });
    }

    const pass = existingUser[0].passwordHash;
    const check = await bcrypt.compare(password, pass);

    if (!check) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }
    // On success, you can return user info (omit sensitive info like passwordHash in real apps)
    return NextResponse.json({ message: 'Login successful', user: {id : existingUser[0].userId, email: existingUser[0].email, name: existingUser[0].name } }, { status: 200 });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
