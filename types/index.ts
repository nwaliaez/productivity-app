// types/index.ts

import { InferSelectModel } from 'drizzle-orm';
import { tasks, assignedTasks, bookmarks } from 'db/schema'; // Adjust the import path
import { SelectBookmark } from 'db/schema'; // Import the inferred bookmark type

import 'next-auth';

export type AssignedUser = {
  userId: number;
  username: string;
  profilePic: string | null; // Use `string | null` if `profilePic` can be null
};

export type SelectTask = InferSelectModel<typeof tasks> & {
  assignedUsers: AssignedUser[];
  isBookmarked: boolean;
};

declare module 'next-auth' {
  interface User {
    username?: string;
    passwordHash?: string;
    avatar: string;
  }

  interface Session {
    user: User;
  }
}
