import { Router } from "express";
import * as authController from '../controllers/auth.controller';
import { authMiddleware } from "../middlewares/auth.middleware";

export const authRouter = Router();

authRouter.post('/login', authController.login);
authRouter.post('/logout', authController.logout);
authRouter.get('/me', authMiddleware, authController.getMe);
