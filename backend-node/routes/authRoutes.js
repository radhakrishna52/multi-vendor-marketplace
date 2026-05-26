const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { email, password, full_name, role } = req.body;
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ detail: 'Email already registered' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashed_password = await bcrypt.hash(password, salt);

    const user = new User({ email, hashed_password, full_name, role: role || 'buyer' });
    await user.save();

    res.json(user);
  } catch (err) {
    res.status(500).json({ detail: err.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ detail: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.hashed_password);
    if (!isMatch) {
      return res.status(400).json({ detail: 'Invalid credentials' });
    }

    const token = jwt.sign({ sub: user.email, id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ 
      access_token: token, 
      token_type: 'bearer',
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        name: user.full_name
      }
    });
  } catch (err) {
    res.status(500).json({ detail: err.message });
  }
});

router.get('/me', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ detail: 'Not authenticated' });
    
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ detail: 'User not found' });
    
    res.json(user);
  } catch (err) {
    res.status(401).json({ detail: 'Invalid token' });
  }
});

module.exports = router;
