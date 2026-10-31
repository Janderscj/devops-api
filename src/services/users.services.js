import logger from '#config/logger.js';
import { db } from '#config/database.js';
import { users } from '#models/user.model.js';
import { eq } from 'drizzle-orm';

export const getAllUsers = async () => {
  // Logic to get all users
  try {
    return await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        createdAt: users.created_at,
        updatedAt: users.updated_at,
      })
      .from(users);
  } catch (e) {
    logger.error(e);
    console.error(e);
    throw new Error('Failed to get all users', e);
  }
};

export const getUserById = async (id) => {
  try {
    return await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        createdAt: users.created_at,
        updatedAt: users.updated_at,
      })
      .from(users)
      .where(eq(users.id, id))
      .limit(1);
  } catch (e) {
    logger.error(e);
    console.error(e);
    throw new Error('Failed to get user by ID', e);
  }
};
//update user by ID
export const updateUserById = async (id, data) => {
  try {
    return await db
      .update({
        name: data.name,
        email: data.email,
        role: data.role,
        updated_at: new Date(),
      })
      .from(users)
      .where(eq(users.id, id));
  } catch (e) {
    logger.error(e);
    console.error(e);
    throw new Error('Failed to update user by ID', e);
  }
};
//delete user by ID
export const deleteUserById = async (id) => {
  try {
    return await db.delete().from(users).where(eq(users.id, id));
  } catch (e) {
    logger.error(e);
    console.error(e);
    throw new Error('Failed to delete user by ID', e);
  }
};
