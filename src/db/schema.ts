// db/schema.ts

import { InferSelectModel } from 'drizzle-orm';
import {
  pgTable,
  serial,
  varchar,
  text,
  integer,
  boolean,
  timestamp,
  date,
  uniqueIndex,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Define Users table
export const users = pgTable('users', {
  userId: serial('user_id').primaryKey(),
  username: varchar('username', { length: 50 }).notNull().unique(),
  email: varchar('email', { length: 100 }).notNull().unique(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  firstName: varchar('first_name', { length: 50 }),
  lastName: varchar('last_name', { length: 50 }),
  profilePic: varchar('profile_pic', { length: 255 }).default(
    'path/to/default/profile_pic.jpg'
  ),
  dateJoined: timestamp('date_joined').defaultNow(),
  lastLogin: timestamp('last_login'),
  isActive: boolean('is_active').default(true),
});

// Define Tasks table
export const tasks = pgTable('tasks', {
  taskId: serial('task_id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  tag: varchar('tag', { length: 50 }),
  status: varchar('status', { length: 50 }).default('pending'),
  priority: varchar('priority', { length: 50, enum: ['low', 'medium', 'high'] })
    .default('medium')
    .notNull(),
  dueDate: date('due_date'),
  createdBy: integer('created_by').references(() => users.userId, {
    onDelete: 'cascade',
  }),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => new Date()),
});

// Define AssignedTasks join table
export const assignedTasks = pgTable('assigned_tasks', {
  assignId: serial('assign_id').primaryKey(),
  taskId: integer('task_id').references(() => tasks.taskId, {
    onDelete: 'cascade',
  }),
  userId: integer('user_id').references(() => users.userId),
  assignedAt: timestamp('assigned_at').defaultNow(), // optional: track assignment time
});

// Define Bookmarks table
export const bookmarks = pgTable(
  'bookmarks',
  {
    bookmarkId: serial('bookmark_id').primaryKey(),
    userId: integer('user_id')
      .notNull()
      .references(() => users.userId, { onDelete: 'cascade' }),
    taskId: integer('task_id')
      .notNull()
      .references(() => tasks.taskId, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => ({
    userTaskUnique: uniqueIndex('unique_user_task').on(
      table.userId,
      table.taskId
    ),
  })
);

// Relations for the users table
export const usersRelations = relations(users, ({ many }) => ({
  createdTasks: many(tasks, {
    relationName: 'createdTasks',
  }),
  assignedTasks: many(assignedTasks, {
    relationName: 'userAssignedTasks',
  }),
  bookmarks: many(bookmarks, {
    relationName: 'userBookmarks', // New relation
  }),
}));

// Relations for the tasks table
export const tasksRelations = relations(tasks, ({ one, many }) => ({
  creator: one(users, {
    fields: [tasks.createdBy],
    references: [users.userId],
  }),
  assignedTasks: many(assignedTasks, {
    relationName: 'taskAssignedUsers', // users assigned to this task
  }),
  bookmarks: many(bookmarks, {
    relationName: 'taskBookmarks', // New relation
  }),
}));

// Relations for the assignedTasks join table
export const assignedTasksRelations = relations(assignedTasks, ({ one }) => ({
  user: one(users, {
    fields: [assignedTasks.userId],
    references: [users.userId],
  }),
  task: one(tasks, {
    fields: [assignedTasks.taskId],
    references: [tasks.taskId],
  }),
}));

// Relations for the bookmarks table
export const bookmarksRelations = relations(bookmarks, ({ one }) => ({
  user: one(users, {
    fields: [bookmarks.userId],
    references: [users.userId],
  }),
  task: one(tasks, {
    fields: [bookmarks.taskId],
    references: [tasks.taskId],
  }),
}));

// Types for each table
export type SelectUser = InferSelectModel<typeof users>;
export type SelectTask = InferSelectModel<typeof tasks>;
export type SelectAssignedTask = InferSelectModel<typeof assignedTasks>;
export type SelectBookmark = InferSelectModel<typeof bookmarks>;
