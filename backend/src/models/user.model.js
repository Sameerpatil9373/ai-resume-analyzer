const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
}, { timestamps: true });

// FIX: Password ko save karne se pehle automatically hash karne ka logic
userSchema.pre("save", async function (next) {
  // Agar password change nahi hua toh hashing skip karo
  if (!this.isModified("password")) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Safety check to prevent OverwriteModelError
module.exports = mongoose.models.User || mongoose.model("User", userSchema);