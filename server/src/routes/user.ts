import express, { Request, Response } from 'express';
import User from '../models/User';

const router = express.Router();

// Create a new user
router.post('/create', async (req: Request, res: Response) => {
  try {
    const { email, name } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }
    
    const user = await User.create({
      email,
      name,
      formsCreated: [],
      accessMap: []
    });
    
    res.status(201).json(user);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// User routes have been simplified - all recipient management is now handled in form routes

export default router;
