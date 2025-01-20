import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';

import { validateRequest } from '../middlewares/validate-requests';
import { User } from '../models/user';
import { BadRequestError } from '../errors/bad-request-error';
import { PasswordHash } from '../utils/password-hash';

const router = express.Router();

router.post('/api/users/signin', 
    [
        body("email").isEmail().withMessage("Email field must be a valid email adress."),
        body("password").trim().notEmpty().withMessage("Password field cannot be empty.")
    ],
    validateRequest,
    async (req: Request, res: Response) => {
        const { email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (!existingUser) {
            throw new BadRequestError('Invalid credentials.')
        }

        const passwordMatch = await PasswordHash.compare(
            existingUser.password,
            password
        )
        if (!passwordMatch) {
            throw new BadRequestError('Invalid credentials.')
        }

        const userJwt = jwt.sign({
            id: existingUser.id,
            email: existingUser.email
            },
            process.env.JWT_KEY!
        );
        req.session = {
            jwt: userJwt
        };

        res.status(200).send(existingUser);
    }
);

export { router as signinRouter };