import { Router, Request, Response } from 'express';
import userRouter from './user.routes';
import authRouter from './auth.routes';
import categoriesRouter from './categories.routes';
import productsRouter from './products.routes';
import movesRouter from './moves.routes';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.get('/ping', (req: Request, res: Response) => {
    res.json({ pong: true });
});

router.use('/auth', authRouter);

router.use(authMiddleware);

router.use('/users', userRouter);
router.use('/categories', categoriesRouter);
router.use('/products', productsRouter);
router.use('/moves', movesRouter);

export default router;
