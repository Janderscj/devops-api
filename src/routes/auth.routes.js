import express from 'express';
import { signup } from '#controllers/auth.controller.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication routes
 */
/**
 * @swagger
 * /api/auth/sign-up:
 *   post:
 *     summary: Sign up a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: josh@example.com
 *               name:
 *                 type: string
 *                 example: Josh Doe
 *               password:
 *                 type: string
 *                 example: Password123!
 *     responses:
 *       201:
 *         description: Successful sign up
 *       400:
 *         description: Missing required fields
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Missing required fields
 */

router.post('/sign-up', signup);

/**
 * @swagger
 * /api/auth/sign-in:
 *   post:
 *     summary: Sign in an existing user
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Successful sign in
 *       400:
 *         description: Validation failed
 */
router.post('/sign-in', (req, res) => {
  res.send('POST /api/auth/sign-in response');
});

/**
 * @swagger
 * /api/auth/sign-out:
 *   post:
 *     summary: Sign out the current user
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Successful sign out
 */
router.post('/sign-out', (req, res) => {
  res.send('POST /api/auth/sign-out response');
});

export default router;
