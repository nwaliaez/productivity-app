import { db } from '@/db';
import { users } from '@/db/schema';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const body = await request.json();

  const { username, password } = body;

  await db.insert(users).values({
    username,
    email: 'hardcode@gmail.com',
    passwordHash: password,
  });
  return NextResponse.json({ success: true });
}
