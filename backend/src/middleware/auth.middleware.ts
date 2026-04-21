import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User, { IUser } from "../models/User.model";

// Extend Express Request to include user
declare global {
    namespace Express {
        interface Request {
            user?: IUser;
        }
    }
}

export const protect = async (req: Request, res: Response, next: NextFunction) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {
            token = req.headers.authorization.split(" ")[1];

            const decoded: any = jwt.verify(token, process.env.JWT_SECRET || "fallback_secret");

            const user = await User.findById(decoded.id).select("-password");
            if (!user) {
                return res.status(401).json({ message: "Not authorized, user not found" });
            }

            req.user = user;
            next();
        } catch (error) {
            console.error(error);
            res.status(401).json({ message: "Not authorized, token failed" });
        }
    }

    if (!token) {
        res.status(401).json({ message: "Not authorized, no token" });
    }
};

// Middleware to check specific permissions
export const hasPermission = (requiredPermission: string) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (req.user && (req.user.role === 'admin' || req.user.permissions.includes(requiredPermission))) {
            next();
        } else {
            res.status(403).json({ message: "Not authorized, insufficient permissions" });
        }
    };
};

export const adminOnly = (req: Request, res: Response, next: NextFunction) => {
    if (req.user && req.user.role === "admin") {
        next();
    } else {
        res.status(403).json({ message: "Not authorized as admin" });
    }
};
