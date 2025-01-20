import express, { Request, Response } from 'express';
import { body } from 'express-validator';

import { validateRequest } from '../middlewares/validate-requests';

const router = express.Router();

router.post('/api/users/signin', 
    [
        body("email").isEmail().withMessage("Email field must be a valid email adress."),
        body("password").trim().notEmpty().withMessage("Password field cannot be empty.")
    ],
    validateRequest,
    (req: Request, res: Response) => {
    }
);

export { router as signinRouter };