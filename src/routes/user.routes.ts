import { Router } from "express";
import * as userController from '../controllers/user.controller';

const userRouter = Router();

userRouter.get('/ping', (req, res) => {
    res.json({ pong: true });
});

userRouter.post('/', userController.registerUser);


export default userRouter;
