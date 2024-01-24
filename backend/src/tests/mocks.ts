import { Request, Response, NextFunction } from 'express';

export const mockVerifyJWT = (req: Request, res: Response, next: NextFunction) => {
    console.log('Attempting to verify JWT (mock)');
    next();
};
