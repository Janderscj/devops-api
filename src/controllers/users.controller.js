import logger from '#config/logger.js';
import {
  getAllUsers,
  getUserById,
  updateUserById,
  deleteUserById,
} from '#services/users.service.js';

// Controller for handling user-related requests

// Fetch all users
export const fetchAllUsers = async (req, res, next) => {
  try {
    logger.info('Fetching all users');
    const allUsers = await getAllUsers();
    res.status(200).json({
      message: 'Fetched all users',
      users: allUsers,
      count: allUsers.length,
    });
  } catch (e) {
    logger.error(e);
    res.status(500).json({ message: 'Failed to get all users', e });
    next(e);
  }
};

// Fetch user by ID
export const fetchUserById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await getUserById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({
      message: 'Fetched user by ID',
      user,
    });
  } catch (e) {
    logger.error(e);
    res.status(500).json({ message: 'Failed to get user by ID', e });
    next(e);
  }
};

// Update user by ID
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const updatedUser = await updateUserById(id, data);
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({
      message: 'Updated user by ID',
      user: updatedUser,
    });
  } catch (e) {
    logger.error(e);
    if (e.message === 'User not found') {
      return res.status(404).json({ message: 'User not found' });
    }
    if (e.message === 'Email already in use') {
      return res.status(409).json({ message: 'Email already in use' });
    }
    res.status(500).json({ message: 'Failed to update user by ID' });
  }
};

// Delete user by ID
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedUser = await deleteUserById(id);
    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({
      message: 'Deleted user by ID',
    });
  } catch (e) {
    logger.error(e);
    if (e.message === 'User not found') {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(500).json({ message: 'Failed to delete user by ID' });
  }
};
