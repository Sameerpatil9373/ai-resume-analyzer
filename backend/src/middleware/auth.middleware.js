const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  try {
    // 1. Get token from header (Format: Bearer <token>)
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Access denied. No token provided." });
    }

    // 2. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // 3. Attach user info to the request object
    req.user = decoded;

    // 4. Move to the next function (the controller)
    next(); 
  } catch (error) {
    console.error("Auth Middleware Error:", error.message);
    res.status(401).json({ message: "Invalid or expired token." });
  }
};

module.exports = authMiddleware;