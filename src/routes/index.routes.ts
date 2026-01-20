import { Router, Request, Response } from 'express';
import userRouter from './user.routes';
import authRouter from './auth.routes';
import categoriesRoutes from './categories.routes';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.get('/ping', (req: Request, res: Response) => {
    res.json({ pong: true });
});

router.use('/auth', authRouter);

router.use(authMiddleware);

router.use('/users', userRouter);
router.use('/categories', categoriesRoutes)

export default router;
