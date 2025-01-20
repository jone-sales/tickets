import { Request, Response, NextFunction } from "express-serve-static-core";
import jwt from 'jsonwebtoken';

import { UnauthorizedError } from "../errors/unauthorized-error";

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
    if (!req.currentUser) {
        return new UnauthorizedError();
    };

    next();
}