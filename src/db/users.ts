import { db } from './index.ts';
import { users } from './schema.ts';
import { eq } from 'drizzle-orm';

export async function getOrCreateUser(uid: string, email: string, displayName?: string, role?: string) {
  try {
    const result = await db.insert(users)
      .values({
        uid,
        email,
        displayName: displayName || '',
        role: role || 'army_officer',
      })
      .onConflictDoUpdate({
        target: users.uid,
        set: {
          email,
          displayName: displayName || '',
          updatedAt: new Date(),
        },
      })
      .returning();

    return result[0];
  } catch (error) {
    console.error('Database user insert/update failed:', error);
    throw new Error('Database user query failed. Please try again later.', { cause: error });
  }
}

export async function getAllUsers() {
  try {
    return await db.select().from(users);
  } catch (error) {
    console.error('Database getUsers failed:', error);
    throw new Error('Database query failed. Please try again later.', { cause: error });
  }
}
