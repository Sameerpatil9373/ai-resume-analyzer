const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// Register a new user
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
   if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    // Check if user already exists
    const existingUser = await User.findOne({ email:email.toLowerCase().trim() });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists with this email" });
    }

    const user = await User.create({ name, email, password });
    res.status(201).json({ message: "User registered successfully! You can now log in." });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Login existing user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Find user by email
    const user = await User.findOne({ email: email.toLowerCase().trim()});
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // 2. Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // 3. Generate JWT Token
    const token = jwt.sign(
      { id: user._id }, 
      process.env.JWT_SECRET, 
      { expiresIn: "24h" }
    );

    res.json({ 
      token, 
      user: { id: user._id, name: user.name, email: user.email } 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};