const express = require("express");
const router = express.Router();
// Ensure the path to your controller is correct!
const { register, login } = require("../controllers/auth.controller");

// Now 'login' and 'register' are defined and can be used here
router.post("/register", register);
router.post("/login", login);

module.exports = router;