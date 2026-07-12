import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretjwtkey';

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    if (!name || !email || !password) {
      return res.status(400).json({ status: 'error', error: { message: 'All fields are required' } });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ status: 'error', error: { message: 'Email already in use' } });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = await User.create({ name, email, passwordHash });
    
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({ 
      status: 'success', 
      data: { token, user: { id: user._id, name: user.name, email: user.email } } 
    });
  } catch (error) {
    res.status(500).json({ status: 'error', error: { message: error.message } });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ status: 'error', error: { message: 'Email and password required' } });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ status: 'error', error: { message: 'Invalid credentials' } });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ status: 'error', error: { message: 'Invalid credentials' } });
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });

    res.status(200).json({ 
      status: 'success', 
      data: { token, user: { id: user._id, name: user.name, email: user.email } } 
    });
  } catch (error) {
    res.status(500).json({ status: 'error', error: { message: error.message } });
  }
};

export const getMe = async (req, res) => {
  try {
    let token = req.headers.authorization;
    if (token && token.startsWith('Bearer ')) {
      token = token.split(' ')[1];
    } else {
      return res.status(401).json({ status: 'error', error: { message: 'Not authorized' } });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id).select('-passwordHash');

    if (!user) {
      return res.status(404).json({ status: 'error', error: { message: 'User not found' } });
    }

    res.status(200).json({ status: 'success', data: { user: { id: user._id, name: user.name, email: user.email } } });
  } catch (error) {
    res.status(401).json({ status: 'error', error: { message: 'Invalid token' } });
  }
};
