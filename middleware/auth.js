const authMiddleware = {
  ensureAuth: (req, res, next) => {
    req.isAuthenticated() ? next() : res.redirect('/');
  },
  ensureGuest: (req, res, next) => {
    req.isAuthenticated() ? res.redirect('/dashboard') : next();
  },
};

export default authMiddleware;
