import { Request, Response, NextFunction } from 'express';
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
import User from "../models/users";

dotenv.config();

export const verifyJWT = async (req: any, res: Response, next: NextFunction): Promise<void> => {
    const authHeader = req.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ message: 'Access token missing or invalid' });
        return;
    }

    const accessToken = authHeader.split(' ')[1];

    try {
        const decoded: any = jwt.verify(accessToken, process.env.JWT_SECRET as string);

        req.email = decoded.email;
        req.token = accessToken;

        const user = await User.findOne({ where: { email: req.email } });

        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        req.user = {
            id: user.id,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            role_id: user.role_id
        };

        next();
    } catch (error) {
        console.error('JWT verification error:', error);
        res.status(403).json({ message: 'Invalid access token' });
    }
};
