import { Router } from "express";
import * as userController from '../controllers/user.controller';
import { uploadAvatar } from "../middlewares/upload.middleware";

const router = Router();

router.get('/ping', (req, res) => {
    res.json({ pong: true });
});

// POST /api/users - Create a new User;
router.post('/', userController.registerUser);

// GET /api/users - List users (With pagination);
router.get('/', userController.listUsers);

// GET /api/users/:id - Get user by id;
router.get('/:id', userController.getUser);

// PUT /api/users/:id - Update user by id;
router.put('/:id', uploadAvatar, userController.updateUser);

// DELETE /api/users/:id - Delete user by id;
router.delete('/:id', userController.deleteUser);


export default router;
