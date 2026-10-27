import express from 'express';
import { signup } from '#controllers/auth.controller.js';

// Routes for user authentication (sign-up, sign-in, sign-out)
const router = express.Router();

// Route for user sign-up
router.post('/sign-up', signup);

// Route for user sign-in
router.post('/sign-in', (req, res) => {
  res.send('POST /api/auth/sign-in response');
});

// Route for user sign-out
router.post('/sign-out', (req, res) => {
  res.send('POST /api/auth/sign-out response');
});

export default router;
