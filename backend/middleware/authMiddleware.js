// backend/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  // 1. Check if the Authorization header exists and starts with "Bearer"
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // 2. Extract the actual token string from the header
      // Example header value: "Bearer eyJhbGciOi..." -> split(' ') splits it at the space
      token = req.headers.authorization.split(' ')[1];

      // 3. Verify the token using your secret key
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 4. Fetch the user profile from the database using the ID inside the token
      // .select('-password') ensures we DO NOT attach the hashed password to the request object
      req.user = await User.findById(decoded.id).select('-password');

      // 5. Let the request proceed to the actual controller function
      next();
    } catch (error) {
      console.error('Token verification failed:', error.message);
      res.status(401).json({ message: 'Not authorized, token failed or expired' });
    }
  }

  // 6. If no token was found in the header at all
  if (!token) {
    res.status(401).json({ message: 'Not authorized, no security token provided' });
  }
};

module.exports = { protect };