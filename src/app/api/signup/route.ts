import { db } from '@db';
import { users } from 'db/schema';
import { NextRequest, NextResponse } from 'next/server';
import { saltAndHashPassword } from '@lib/server/auth';
import { eq } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { username, email, password } = body;
    console.log('Received data:', body);

    // Input validation
    if (!username || !email || !password) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if the user already exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email));
    console.log(existingUser);

    if (existingUser.length > 0) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }

    // Hash the password
    const passwordHash = await saltAndHashPassword(password);

    // Insert the new user
    await db.insert(users).values({
      username,
      email,
      passwordHash,
    });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error('Error processing POST request:', error);

    // Handle specific errors if necessary
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: 'Invalid JSON payload' },
        { status: 400 }
      );
    }

    // Default to 500 Internal Server Error for unexpected errors
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
