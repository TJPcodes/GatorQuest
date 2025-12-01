// Ensures that the authenticated user (req.user) has admin privileges.
// This middleware must run AFTER `protect`, because protect populates req.user.


export const adminOnly = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin access required" });
  }
  next(); // User is admin then allow request to continue
};
