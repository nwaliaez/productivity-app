// pages/api/users.ts
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/Task';

export async function GET(req: NextRequest, res: NextResponse) {
  await dbConnect();
  // const users = await User.find({});
  return NextResponse.json({ success: true });
}
