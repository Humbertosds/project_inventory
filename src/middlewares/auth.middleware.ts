import { RequestHandler } from "express";
import { AppError } from "../utils/appError";
import { validateToken } from "../services/user.service";

export const authMiddleware: RequestHandler = async (req, res, next) => {
    const notAuthorizedError = new AppError('Unauthorized', 401);

    const authHeader = req.headers.authorization;
    if (!authHeader) return next(notAuthorizedError);

    const [scheme, token] = authHeader.split(' ');

    if (scheme !== "Bearer" || !scheme) return next(notAuthorizedError);

    const user = await validateToken(token);
    if (!user) return next(notAuthorizedError);

    req.user = user;
    next();
}
