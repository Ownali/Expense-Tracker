const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const generateToken = (user) =>
  jwt.sign(
    { id: user._id, name: user.name, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

const register = async (req, res) => {
  try {
    const { name, email, password, securityQuestion, securityAnswer } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: "All fields are required" });

    const existing = await User.findOne({ email });
    if (existing)
      return res.status(409).json({ message: "Email already registered" });

    const hashed = await bcrypt.hash(password, 10);
    const hashedAnswer = securityAnswer
      ? await bcrypt.hash(securityAnswer.toLowerCase().trim(), 10)
      : "";

    const user = await User.create({
      name, email,
      password: hashed,
      securityQuestion: securityQuestion || "",
      securityAnswer: hashedAnswer,
    });

    const token = generateToken(user);
    res.status(201).json({
      message: "Registered successfully",
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "All fields are required" });

    const user = await User.findOne({ email });
    if (!user) 
    return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) 
    return res.status(401).json({ message: "Invalid credentials" });

    const token = generateToken(user);
    res.status(200).json({
      message: "Login successful",
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Step 1: verify email exists and return security question
const getSecurityQuestion = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) 
    return res.status(400).json({ message: "Email is required" });

    const user = await User.findOne({ email });
    if (!user)
     return res.status(404).json({ message: "No account found with this email" });
    if (!user.securityQuestion)
      return res.status(400).json({ message: "No security question set for this account" });

    res.status(200).json({ securityQuestion: user.securityQuestion });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Step 2: verify answer and reset password
const resetPassword = async (req, res) => {
  try {
    const { email, securityAnswer, newPassword } = req.body;
    if (!email || !securityAnswer || !newPassword)
      return res.status(400).json({ message: "All fields are required" });

    if (newPassword.length < 6)
      return res.status(400).json({ message: "Password must be at least 6 characters" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(
      securityAnswer.toLowerCase().trim(),
      user.securityAnswer
    );
    if (!isMatch)
      return res.status(401).json({ message: "Security answer is incorrect" });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.status(200).json({ message: "Password reset successfully. You can now log in." });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = { register, login, getSecurityQuestion, resetPassword };
