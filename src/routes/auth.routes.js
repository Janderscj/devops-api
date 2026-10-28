import express from 'express';
import { signup, signIn, signOut } from '#controllers/auth.controller.js';

// Routes for user authentication (sign-up, sign-in, sign-out)
const router = express.Router();

// Route for user sign-up
router.post('/sign-up', signup);

// Route for user sign-in
router.post('/sign-in', signIn);

// Route for user sign-out
router.post('/sign-out', signOut);

export default router;
