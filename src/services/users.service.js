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
export const updateUserById = async (id, updates) => {
  try {
    const [existingUser] = await getUserById(id);
    if (!existingUser) {
      throw new Error('User not found');
    }
    if (updates.email && updates.email !== existingUser.email) {
      const [emailExists] = await db
        .select()
        .from(users)
        .where(eq(users.email, updates.email))
        .limit(1);
      if (emailExists) {
        throw new Error('Email already in use');
      }
    }
    const [updatedUser] = await db
      .update(users)
      .set({
        name: updates.name,
        email: updates.email,
        role: updates.role,
        updated_at: new Date(),
      })
      .where(eq(users.id, id))
      .returning({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        createdAt: users.created_at,
        updatedAt: users.updated_at,
      });
    return updatedUser;
  } catch (e) {
    logger.error(e);
    console.error(e);
    throw e;
  }
};
//delete user by ID
export const deleteUserById = async (id) => {
  try {
    const [deletedUser] = await db.delete(users).where(eq(users.id, id)).returning({
      id: users.id,
      name: users.name,
      email: users.email,
      role: users.role,
    });
    if (!deletedUser) {
      throw new Error('User not found');
    }
    return deletedUser;
  } catch (e) {
    logger.error(e);
    console.error(e);
    throw e;
  }
};
