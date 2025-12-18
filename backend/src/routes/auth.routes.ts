import { Router } from 'express';
import bcrypt from 'bcrypt';
import { User } from '../models/user.model';
import { generateToken } from '../utils/jwt';

const router = Router();

/**
 * LOGIN / SIGNUP (AUTO)
 */
console.log('AUTH ROUTES FILE LOADED');

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({ message: 'User not found. Please sign up.' });
  }

  // 🔹 Validate password
  const isMatch = await bcrypt.compare(password, user.password as string);
  if (!isMatch) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  // 🔹 Generate JWT
  const token = generateToken({
    id: user._id,
    email: user.email
  });

  res.json({
    token,
    user: {
      id: user._id,
      email: user.email
    }
  });
});

/**
 * SIGNUP
 */
router.post('/signup', async (req, res) => {
  const { email, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: 'User already exists' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({ email, password: hashedPassword });

  const token = generateToken({
    id: user._id,
    email: user.email
  });

  res.status(201).json({
    token,
    user: {
      id: user._id,
      email: user.email
    }
  });
});

export default router;