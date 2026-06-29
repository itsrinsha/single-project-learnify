const approvalMiddleware = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  // Admin and Students are approved by default
  if (req.user.role === "admin" || req.user.role === "student") {
    return next();
  }

  // Instructors must be approved
  if (req.user.role === "instructor") {
    if (req.user.approvalStatus === "approved") {
      return next();
    } else {
      return res.status(403).json({
        message: "Your instructor account is not approved yet.",
        approvalStatus: req.user.approvalStatus,
      });
    }
  }

  next();
};

export default approvalMiddleware;
