// src/api/middleware/auth.middleware.ts
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

// Tambahkan properti 'user' ke tipe Request Express
declare global {
    namespace Express {
        interface Request {
            user?: any;
        }
    }
}

export const protect = (req: Request, res: Response, next: NextFunction) => {
    let token;
    
    // Check for token in Authorization header (Bearer token)
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
            req.user = { userId: decoded.userId };
            return next();
        } catch (error) {
            console.error('JWT verification error:', error);
            return res.status(401).json({ message: 'Invalid token' });
        }
    }
    
    // Check for token in cookies (for session-based auth)
    if (req.cookies && req.cookies.token) {
        try {
            token = req.cookies.token;
            const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
            req.user = { userId: decoded.userId };
            return next();
        } catch (error) {
            console.error('Cookie token verification error:', error);
            return res.status(401).json({ message: 'Invalid session token' });
        }
    }
    
    // No token found
    console.error('No authentication token provided');
    return res.status(401).json({ message: 'Not authorized, no token provided' });
};

// Optional: Add a more permissive middleware for development/testing
export const optionalAuth = (req: Request, res: Response, next: NextFunction) => {
    let token;
    
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
            req.user = { userId: decoded.userId };
        } catch (error) {
            // Silently fail for optional auth
            console.warn('Optional auth failed:', error);
        }
    } else if (req.cookies && req.cookies.token) {
        try {
            token = req.cookies.token;
            const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
            req.user = { userId: decoded.userId };
        } catch (error) {
            // Silently fail for optional auth
            console.warn('Optional cookie auth failed:', error);
        }
    }
    
    next();
};