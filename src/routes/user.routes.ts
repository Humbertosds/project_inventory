import { Router } from "express";
import * as userController from '../controllers/user.controller';

const userRouter = Router();

userRouter.get('/ping', (req, res) => {
    res.json({ pong: true });
});

// POST /api/users - Create a new User;
userRouter.post('/', userController.registerUser);

// GET /api/users - List users (With pagination);
userRouter.get('/', userController.listUsers);

// GET /api/users/:id - Get user by id;
userRouter.get('/:id', userController.getUser);

// PUT /api/users/:id - Update user by id;
userRouter.put('/:id', userController.updateUser);

// DELETE /api/users/:id - Delete user by id;
userRouter.delete('/:id', userController.deleteUser);


export default userRouter;
