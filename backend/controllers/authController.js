import generateToken from "../utils/generateToken.js";
import { asyncHandler } from "../middleware/trycatchmiddleware.js";

import {
  loginUser,
  registerUser,
} from "../services/authServices.js";
import { OAuth2Client } from "google-auth-library";
import User from "../models/User.js"; 
import crypto from "crypto";
import bcrypt from "bcryptjs";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
//  REGISTER
export const register = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  const user = await registerUser({ name, email, password, role });

  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    approvalStatus: user.approvalStatus,
    token: generateToken(user._id),
    message: "User registered successfully",
  });
});

//  LOGIN
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  

  const user = await loginUser({ email, password });

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    approvalStatus: user.approvalStatus,
    token: generateToken(user._id),
  });
});

export const googleAuth = asyncHandler(async (req, res) => {
  const { token, role } = req.body;

  if (!token) {
    return res.status(400).json({ message: "Google token is required" });
  }

  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();
  const { email, name, picture } = payload;

  let user = await User.findOne({ email });

  if (!user) {
    // Generate a secure random password for Google-only accounts
    const fallbackPassword = await bcrypt.hash(crypto.randomBytes(32).toString("hex"), 10);

    user = await User.create({
      name,
      email,
      password: fallbackPassword,
      role: role || "student", // ✅ Assign the requested role to NEW users
      isVerified: true,
      profileImage: picture,
      approvalStatus: (role || "student") === "instructor" ? "pending" : "approved",
    });
  }

  // ✅ Existing users keep their original role. 
  // Frontend handles the "Access Denied" if a Student tries to login via Instructor portal.

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    approvalStatus: user.approvalStatus,
    token: generateToken(user._id),
  });
});
