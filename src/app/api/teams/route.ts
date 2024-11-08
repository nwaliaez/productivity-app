import { db } from '@db';
import { users } from 'db/schema';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Fetch user id and username from the users table
    const result = await db
      .select({ userId: users.userId, username: users.username })
      .from(users);

    // Map result to an array of objects with id and username
    const usersData = result.map((user) => ({
      userId: user.userId,
      username: user.username,
    }));

    // Return the data in JSON format
    return NextResponse.json({ users: usersData }, { status: 200 });
  } catch (error) {
    console.error('Error fetching user data:', error);

    // Return 500 Internal Server Error for unexpected errors
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
