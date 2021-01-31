import express, { Router } from 'express';
import passport from 'passport';

const router = express.Router();

// Authenticate with Google
router.get('/google', passport.authenticate('google', { scope: ['profile'] }));

// Google auth callback
router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect('/dashboard');
  }
);

// Logout
router.get('/logout', (req, res) => {
  req.logOut();
  res.redirect('/');
});

export default router;
