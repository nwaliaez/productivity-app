import { db } from '@db';
import { tasks, assignedTasks, bookmarks, users } from 'db/schema';
import { NextRequest, NextResponse } from 'next/server';
import { eq, and } from 'drizzle-orm';
import { getToken } from 'next-auth/jwt';

export async function GET(request: NextRequest) {
  const secret = process.env.AUTH_SECRET;
  const payload = await getToken({ req: request, secret });

  const userId = payload?.id as number;

  try {
    const params = request.nextUrl.searchParams.get('params');
    const bookmarkFilter = params === 'bookmark';

    // Build the base query
    let allTasksQuery = db
      .select({
        taskId: tasks.taskId,
        title: tasks.title,
        description: tasks.description,
        tag: tasks.tag,
        status: tasks.status,
        priority: tasks.priority,
        dueDate: tasks.dueDate,
        createdBy: tasks.createdBy,
        isBookmarked: bookmarks.bookmarkId,
        assignedUserId: assignedTasks.userId,
        assignedUsername: users.username,
        assignedUserPic: users.profilePic, // Assuming 'profilePic' field exists
      })
      .from(tasks)
      .leftJoin(assignedTasks, eq(assignedTasks.taskId, tasks.taskId))
      .leftJoin(users, eq(users.userId, assignedTasks.userId))
      .leftJoin(
        bookmarks,
        and(eq(bookmarks.taskId, tasks.taskId), eq(bookmarks.userId, userId))
      )
      .where(
        bookmarkFilter
          ? and(eq(tasks.createdBy, userId), eq(bookmarks.userId, userId))
          : eq(tasks.createdBy, userId)
      );

    const allTasksData = await allTasksQuery;

    // Group tasks and assigned users
    const tasksMap = new Map<number, any>();

    allTasksData.forEach((row) => {
      const taskId = row.taskId;
      if (!tasksMap.has(taskId)) {
        tasksMap.set(taskId, {
          taskId: taskId,
          title: row.title,
          description: row.description,
          tag: row.tag,
          status: row.status,
          priority: row.priority,
          dueDate: row.dueDate,
          createdBy: row.createdBy,
          isBookmarked: row.isBookmarked,
          assignedUsers: [],
        });
      }
      const task = tasksMap.get(taskId);
      if (row.assignedUserId) {
        task.assignedUsers.push({
          userId: row.assignedUserId,
          username: row.assignedUsername,
          profilePic: row.assignedUserPic,
        });
      }
    });

    const tasksWithAssignedUsers = Array.from(tasksMap.values());

    return NextResponse.json({ success: true, tasks: tasksWithAssignedUsers });
  } catch (error) {
    console.error('Error retrieving tasks:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to retrieve tasks' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const secret = process.env.AUTH_SECRET;
    const payload = await getToken({ req: request, secret });

    const userId = payload?.id as number;

    // Destructure the form data
    const { title, description, tag, status, priority, dueDate, assignedTo } =
      body;

    // Convert dueDate to a string format if it's provided
    const dueDateString = dueDate
      ? new Date(dueDate).toISOString().split('T')[0]
      : null;

    // Insert task into the tasks table
    const [newTask] = await db
      .insert(tasks)
      .values({
        title,
        description,
        tag,
        status,
        priority,
        dueDate: dueDateString, // Use the formatted string
        createdBy: userId, // Should be the ID of the user creating the task
      })
      .returning(); // Returns the inserted row, including taskId

    // If assignedTo is provided and it's an array with entries
    if (Array.isArray(assignedTo) && assignedTo.length > 0) {
      // Prepare the array of values to insert
      const assignedTasksValues = assignedTo.map(
        (assignedUserId: { label: string; value: string }) => ({
          taskId: newTask.taskId,
          userId: Number(assignedUserId.value),
        })
      );
      console.log(assignedTasksValues, '--assignedTasksValues--');

      // Insert multiple entries into assignedTasks table
      await db.insert(assignedTasks).values(assignedTasksValues);
    }

    return NextResponse.json({ success: true, taskId: newTask.taskId });
  } catch (error) {
    console.error('Error inserting task:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create task' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();

    // Destructure the fields you want to update from the request body
    const {
      taskId,
      title,
      description,
      tag,
      status,
      priority,
      dueDate,
      assignedTo,
    } = body;

    // Ensure taskId is provided to identify which task to update
    if (!taskId) {
      return NextResponse.json(
        { success: false, message: 'Task ID is required to update a task.' },
        { status: 400 }
      );
    }

    // Convert dueDate to a string format if it's provided
    const dueDateString = dueDate
      ? new Date(dueDate).toISOString().split('T')[0]
      : null;

    // Update the task in the tasks table
    const [updatedTask] = await db
      .update(tasks)
      .set({
        ...(title && { title }),
        ...(description && { description }),
        ...(tag && { tag }),
        ...(status && { status }),
        ...(priority && { priority }),
        dueDate: dueDateString, // Use the formatted date or null
      })
      .where(eq(tasks.taskId, taskId))
      .returning(); // Return the updated task

    // Update assigned users if assignedTo is provided and is an array
    if (Array.isArray(assignedTo)) {
      // Remove existing assignments for the task
      await db.delete(assignedTasks).where(eq(assignedTasks.taskId, taskId));

      // Add new assignments from the assignedTo array
      const newAssignments = assignedTo.map((userId: number) => ({
        taskId,
        userId,
      }));

      await db.insert(assignedTasks).values(newAssignments);
    }

    return NextResponse.json({ success: true, updatedTask });
  } catch (error) {
    console.error('Error updating task:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update task' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const taskId = Number(searchParams.get('taskId'));

    // Ensure taskId is provided to identify which task to delete
    if (!taskId) {
      return NextResponse.json(
        { success: false, message: 'Task ID is required to delete a task.' },
        { status: 400 }
      );
    }

    const secret = process.env.AUTH_SECRET;
    const payload = await getToken({ req: request, secret });
    const userId = payload?.id as number;

    // Check if the task exists and is created by the user
    const taskExists = await db
      .select()
      .from(tasks)
      .where(and(eq(tasks.taskId, taskId), eq(tasks.createdBy, userId)))
      .limit(1)
      .then((res) => res.length > 0);

    if (!taskExists) {
      return NextResponse.json(
        { success: false, message: 'Task not found or unauthorized.' },
        { status: 404 }
      );
    }

    // Delete the task from the tasks table
    await db.delete(tasks).where(eq(tasks.taskId, taskId));

    // Optionally, delete associated assigned tasks
    await db.delete(assignedTasks).where(eq(assignedTasks.taskId, taskId));

    return NextResponse.json({
      success: true,
      message: 'Task deleted successfully.',
    });
  } catch (error) {
    console.error('Error deleting task:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete task' },
      { status: 500 }
    );
  }
}
