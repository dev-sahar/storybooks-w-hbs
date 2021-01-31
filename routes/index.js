import express from 'express';

import Story from '../models/story.js';

import authMiddleware from '../middleware/auth.js';
const { ensureAuth, ensureGuest } = authMiddleware;

const router = express.Router();

// Login
router.get('/', ensureGuest, (req, res) => {
  res.render('login', {
    layout: 'login',
  });
});

// Dashboard
router.get('/dashboard', ensureAuth, async (req, res) => {
  try {
    const stories = await Story.find({ user: req.user.id }).lean();

    res.render('dashboard', {
      name: req.user.firstName,
      stories,
    });
  } catch (err) {
    console.error(err);
    res.render('error/500');
  }
});

export default router;
