import { RequestHandler } from "express";
import { listUsersSchema, registerUserSchema, updateUserSchema, userIdSchema } from "../validators/user.validator";
import * as userService from "../services/user.service";
import { AppError } from "../utils/appError";
import { saveAvatar } from "../services/file.service";

export const registerUser: RequestHandler = async (req, res) => {
    const data = registerUserSchema.parse(req.body);
    const user = await userService.registerUser(data);

    res.status(201).json({ error: null, data: user });
}

export const listUsers: RequestHandler = async (req, res) => {
    const { offset, limit } = listUsersSchema.parse(req.query)
    const users = await userService.listUsers(offset, limit);

    res.status(200).json({ error: null, data: users });
}

export const getUser: RequestHandler = async (req, res) => {
    const { id } = userIdSchema.parse(req.params);
    const user = await userService.getUserByIdPublic(id);
    if (!user) throw new AppError('User not found', 404);

    res.status(200).json({ error: null, data: user });
};

export const updateUser: RequestHandler = async (req, res) => {
    const { id } = userIdSchema.parse(req.params);
    const data = updateUserSchema.parse(req.body);

    let avatarFilename: string | undefined;
    if (req.file) {
        avatarFilename = await saveAvatar(req.file.buffer, req.file.originalname);
    }
    const updateData = { ...data };
    if (avatarFilename) {
        updateData.avatar = avatarFilename
    }

    const updatedUser = await userService.updateUser(id, updateData);

    res.status(200).json({ error: null, data: updatedUser })
}

export const deleteUser: RequestHandler = async (req, res) => {
    const { id } = userIdSchema.parse(req.params);
    const deletedUser = await userService.deleteUser(id);
    if (!deletedUser) throw new AppError('User not found', 404);

    res.status(200).json({ error: null, data: null });
}
