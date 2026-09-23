import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      message: "Name, email, and password are required",
    });
  }

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return res.status(409).json({
      message: "Email already registered",
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  return res.status(201).json({
    message: "User registered successfully",
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
  });
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: "Email and password are required",
    });
  }

   const user = await User.findOne({ email });

   if (!user) {
     return res.status(401).json({
       message: "Invalid email or password",
     });
   }

   const isPasswordValid = await bcrypt.compare(password, user.password);

   if (!isPasswordValid) {
     return res.status(401).json({
       message: "Invalid email or password",
     });
   }

   const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
     expiresIn: "1d",
   });
  
  return res.status(200).json({
    message: "Login successful",
    token,
  });
};

const getCurrentUser = async (req, res) => {
  const user = await User.findById(req.userId).select("-password");

  return res.status(200).json({
    user,
  });
};

const logoutUser = async (req, res) => {
  return res.status(200).json({
    message: "Logout successful",
  });
};

const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({
      message: "Current password and new password are required",
    });
  }

  const user = await User.findById(req.userId);

  if (!user) {
    return res.status(404).json({
      message: "User not found",
    });
  }

  const isPasswordValid = await bcrypt.compare(currentPassword, user.password);

  if (!isPasswordValid) {
    return res.status(401).json({
      message: "Current password is incorrect",
    });
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  user.password = hashedPassword;

  await user.save();

  return res.status(200).json({
    message: "Password changed successfully",
  });
};

export { registerUser, loginUser, getCurrentUser, logoutUser, changePassword };
