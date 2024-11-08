import { db } from '@db';
import { users } from 'db/schema';
import { and, eq } from 'drizzle-orm';
import { User } from 'next-auth';

export async function getUserFromDb(username: string): Promise<User | null> {
  try {
    const result = await db
      .select()
      .from(users)
      .where(eq(users.username, username))
      .limit(1)
      .execute();

    if (result[0]) {
      const userFromDb = result[0];
      const user: User = {
        id: String(userFromDb.userId),
        avatar: '/avatars/default-avatar.jpg',
        ...userFromDb,
      };
      console.log(user, '--USER--');

      return user;
    }
    return null;
    // Drizzle ORM returns an array; return the first user or null
  } catch (error) {
    console.error('Error fetching user from database:', error);
    throw new Error('Database query failed.');
  }
}
