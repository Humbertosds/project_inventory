import { RequestHandler } from "express";
import { authLoginSchema } from "../validators/auth.validator";
import * as userService from '../services/user.service';
import { AppError } from "../utils/appError";

export const login: RequestHandler = async (req, res) => {
    const data = authLoginSchema.parse(req.body);
    const result = await userService.login(data.email, data.password);

    if (!result) throw new AppError('invalid Credentials', 401);

    res.status(200).json({ error: null, data: result });
};

export const logout: RequestHandler = async (req, res) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const [_, token] = authHeader.split(' '); // Bearer 3297fhs9h3297fhh (example);
        if (token) {
            await userService.logout(token);
        }
    }

    res.status(200).json({ error: null, data: { message: 'Logout successful' } })
};

export const getMe: RequestHandler = async (req, res) => {
    if (!req.user) return null;

    const user = await userService.getUserByIdPublic(req.user.id);
    if (!user) throw new AppError('User not found', 404);

    res.json({ error: null, data: user })
}
