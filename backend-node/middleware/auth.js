const jwt = require('jsonwebtoken');

const requireAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ detail: 'No authorization header' });
    
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ detail: 'Invalid or expired token' });
  }
};

const requireAdmin = (req, res, next) => {
  requireAuth(req, res, () => {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ detail: 'Access denied: Admin only' });
    }
    next();
  });
};

module.exports = { requireAuth, requireAdmin };
