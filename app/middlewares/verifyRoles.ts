import { Request, Response, NextFunction } from "express";

const verifyRoles = (allowedRoles: string[]) => {
  return (req: any, res: Response, next: NextFunction): void => {
    const user = req.user;

    if (!user || !user.role_id) {
      res.status(401).json({ message: "Unauthorized: User or role not found" });
      return;
    }

    if (!allowedRoles.includes(user.role_id)) {
      res.status(403).json({ message: "Forbidden: You do not have access to this resource" });
      return;
    }

    next(); // ✅ Ensure this is called only when allowed
  };
};

export default verifyRoles;
