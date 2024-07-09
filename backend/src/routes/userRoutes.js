import express from 'express';
import {
  loginUser,
  logoutUser,
  registerUser,
  getUser,
  updateUser,
} from '../controllers/auth/userController.js';
import {protect} from '../middleware/authModdleware.js';

const router = express.Router ();

router.post ('/register', registerUser);
router.post ('/login', loginUser);
router.get ('/logout', logoutUser);
router.get ('/user', protect, getUser);
router.patch('/user', protect, updateUser);

export default router;
