import { NextRequest, NextResponse } from 'next/server';
import { drizzle } from 'drizzle-orm/neon-http';
import { eq } from 'drizzle-orm';
import { users } from '@/app/db/schema';
import bcrypt from 'bcryptjs';

const db = drizzle(process.env.DATABASE_URL!);



// Function to create user context after signup
const createContext = async (email: string, name: string, userId: number) => {
  try {
    const baseUrl = process.env.BASE_URL;

    if (!baseUrl) {
      throw new Error("BASE_URL is not defined");
    }

    const res = await fetch(`${baseUrl}/api/context`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        user_id: userId,
        name: name,
      }),
    });

    const data = await res.json();
    console.log("createContext response:", data);
  } catch (err) {
    console.error("Context creation error:", err);
  }
};


export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password } = body;

    if (!name || !email || !password) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const existingUser = await db.select().from(users).where(eq(users.email, email));

    if (existingUser.length > 0) {
      return NextResponse.json({ message: 'User already exists' }, { status: 409 });
    }

    const saltRounds = 10;
    const hash = bcrypt.hashSync(password, saltRounds);

    const res = await db.insert(users).values({
      name,
      email,
      passwordHash: hash,
    }).returning();

    const createdUser = res[0];

    // Create context after successful signup
    await createContext(email, name, createdUser.userId);

    return NextResponse.json({ message: 'User created successfully' }, { status: 201 });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
