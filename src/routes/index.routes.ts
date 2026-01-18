import { Router, Request, Response } from 'express';
import userRouter from './user.routes';
import { authRouter } from './auth.routes';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.get('/ping', (req: Request, res: Response) => {
    res.json({ pong: true });
});

router.use('/auth', authRouter);

router.use(authMiddleware);

router.use('/users', userRouter);

export default router;
