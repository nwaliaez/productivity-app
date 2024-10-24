// pages/api/users.ts
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Task from '@/models/Task';

// Get Task
export async function GET(req: NextRequest) {
  await dbConnect();

  // Fetch all tasks from the database
  const tasks = await Task.find({});

  return NextResponse.json({ success: true, data: tasks });
}

// Create Task
export async function POST(req: NextRequest, res: NextResponse) {
  await dbConnect();
  const body = await req.json();

  // Create a new task using either request body or dummy data
  const newTask = new Task(body);

  // Save the task to the database
  await newTask.save();

  return NextResponse.json({ success: true });
}
