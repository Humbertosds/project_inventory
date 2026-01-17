import { RequestHandler } from "express";
import { registerUserSchema } from "../validators/user.validator";
import * as userService from "../services/user.service";

export const registerUser: RequestHandler = async (req, res) => {
    const data = registerUserSchema.parse(req.body);
    const user = await userService.registerUser(data);
    res.status(201).json({ error: null, data: user });
}
