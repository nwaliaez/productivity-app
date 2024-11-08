import { db } from '@db';
import { tasks, bookmarks } from 'db/schema';
import { NextRequest, NextResponse } from 'next/server';
import { and, eq } from 'drizzle-orm';
import { getServerSideProps } from 'next/dist/build/templates/pages';
import { getToken } from 'next-auth/jwt';

export async function POST(request: NextRequest) {
  try {
    const secret = process.env.AUTH_SECRET;
    const payload = await getToken({ req: request, secret });

    const userId = payload?.id as number;
    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();

    const { taskId } = body;

    if (!taskId) {
      return NextResponse.json(
        { success: false, message: 'taskId is required' },
        { status: 400 }
      );
    }

    // Check if the task exists
    const taskExists = await db
      .select()
      .from(tasks)
      .where(eq(tasks.taskId, taskId))
      .limit(1)
      .then((res) => res.length > 0);

    if (!taskExists) {
      return NextResponse.json(
        { success: false, message: 'Task does not exist' },
        { status: 404 }
      );
    }

    // Insert bookmark
    const [newBookmark] = await db
      .insert(bookmarks)
      .values({
        userId,
        taskId,
      })
      .returning();

    return NextResponse.json({ success: true, bookmark: newBookmark });
  } catch (error: unknown) {
    console.error('Error adding bookmark:', error);

    return NextResponse.json(
      { success: false, message: 'Failed to add bookmark' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const secret = process.env.AUTH_SECRET;
    const payload = await getToken({ req: request, secret });

    const userId = payload?.id as number;

    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();

    const { taskId } = body;

    if (!taskId) {
      return NextResponse.json(
        { success: false, message: 'taskId is required' },
        { status: 400 }
      );
    }

    // Delete the bookmark
    const deletedBookmark = await db
      .delete(bookmarks)
      .where(and(eq(bookmarks.userId, userId), eq(bookmarks.taskId, taskId)))
      .returning();

    if (deletedBookmark.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Bookmark not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: 'Bookmark removed' });
  } catch (error) {
    console.error('Error removing bookmark:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to remove bookmark' },
      { status: 500 }
    );
  }
}
