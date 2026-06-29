import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const authMiddleware = async (req, res, next) => {
  try {
    let token;
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith("Bearer")) {
      token = authHeader.split(" ")[1];
    } else if (req.query.token) {
      token = req.query.token;
    }

    if (!token) {
      const err = new Error("Not authorized");
      err.statusCode = 401;
      return next(err);
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decoded.id).select("-password");
    
    if (req.user && req.user.isBlocked) {
      const err = new Error("Your account has been blocked.");
      err.statusCode = 403;
      return next(err);
    }

    next();
  } catch (error) {
    const err = new Error("Token failed");
    err.statusCode = 401;
    next(err);
  }
};