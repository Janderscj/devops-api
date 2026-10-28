import bcrypt from 'bcrypt';
import logger from '#config/logger.js';
import { db } from '#config/database.js';
import { users } from '#models/user.model.js';
import { eq } from 'drizzle-orm';

// Service functions for handling authentication and user management

// Hashes a password using bcrypt and returns the hashed password. Throws an error if hashing fails.
export const hashPassword = async (password) => {
  try {
    return await bcrypt.hash(password, 10);
  } catch (e) {
    logger.error('Failed to hash password', e);
    throw new Error('Failed to hash password', e);
  }
};
// Compares a plain password with a hashed password. Returns true if they match, false otherwise. Throws an error if comparison fails.
export const comparePassword = async (password, hashedPassword) => {
  try {
    return await bcrypt.compare(password, hashedPassword);
  } catch (e) {
    logger.error('Failed to compare password', e);
    throw new Error('Failed to compare password', e);
  }
};
// Authenticates a user by email and password. Returns the user if authentication is successful. Throws an error if authentication fails.
export const authenticateUser = async ({ email, password }) => {
  try {
    const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);
    if (!user) throw new Error('User not found');

    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) throw new Error('Invalid password');

    return user;
  } catch (e) {
    logger.error(`Failed to authenticate user: ${e}`);
    throw e;
  }
};
// Creates a new user with the given details. Returns the newly created user. Throws an error if creation fails.
export const createUser = async ({ name, email, password, role = 'user' }) => {
  try {
    const existingUser = await db.select().from(users).where(eq(users.email, email)).limit(1);

    if (existingUser.length > 0) throw new Error('User with this email already exists');

    const password_hash = await hashPassword(password);

    const [newUser] = await db
      .insert(users)
      .values({ name, email, password: password_hash, role })
      .returning({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        created_at: users.created_at,
      });

    logger.info(`User ${newUser.email} created successfully`);
    return newUser;
  } catch (e) {
    logger.error(`Failed to create user: ${e}`);
    throw e;
  }
};
