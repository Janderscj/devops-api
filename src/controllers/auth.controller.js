import logger from '#config/logger.js';
import { formatValidationError } from '#utils/format.js';
import { signupSchema, signInSchema } from '#validations/auth.validation.js';
import { createUser, authenticateUser } from '#services/auth.service.js';
import { jwttoken } from '#utils/jwt.js';
import { cookies } from '#utils/cookies.js';

// Controller for handling user authentication and registration
export const signup = async (req, res, next) => {
  try {
    const validationResult = signupSchema.safeParse(req.body);

    if (!validationResult.success) {
      return res.status(400).json({
        error: 'validation failed',
        details: formatValidationError(validationResult.error),
      });
    }

    // Extract validated data from the request body
    const { name, email, password, role } = validationResult.data;

    // Create a new user in the database
    const user = await createUser({ name, email, password, role });

    // Generate a JWT token for the newly created user
    const token = jwttoken.sign({ id: user.id, email: user.email, role: user.role });

    // Set the JWT token as a cookie in the response
    cookies.set(res, 'token', token);

    // Respond with the newly created user and the JWT token
    logger.info(`User registered successfully: ${(name, email, role)}`);
    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (e) {
    logger.error('signup error', e);

    // Handle specific error cases before passing to the next middleware
    if (e.message === 'User with this email already exists') {
      return res.status(409).json({ e: 'Email already exists' });
    }
    next(e);
  }
};
// Controller for handling user sign-in
export const signIn = async (req, res, next) => {
  try {
    const validationResult = signInSchema.safeParse(req.body);

    if (!validationResult.success) {
      return res.status(400).json({
        error: 'validation failed',
        details: formatValidationError(validationResult.error),
      });
    }

    // Extract validated data from the request body
    const { email, password } = validationResult.data;

    // Implement your sign-in logic here, e.g., check user credentials
    const user = await authenticateUser({ email, password });

    const token = jwttoken.sign({ id: user.id, email: user.email, role: user.role });

    // Set the JWT token as a cookie in the response
    cookies.set(res, 'token', token);

    // Respond with the authenticated user and the JWT token
    logger.info(`User signed in successfully: ${email}`);
    res.status(200).json({
      message: 'User signed in successfully',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (e) {
    logger.error('Sign-In error', e);

    if (e.message === 'User not found' || e.message === 'Invalid password') {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    next(e);
  }
};
export const signOut = async (req, res, next) => {
  try {
    cookies.clear(res, 'token');

    logger.info('User Signed out successfully');
    res.status(200).json({ message: 'User signed out successfully' });
  } catch (e) {
    logger.error('signout error', e);
    next(e);
  }
};
