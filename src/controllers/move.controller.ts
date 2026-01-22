import { RequestHandler } from "express";
import * as moveService from '../services/move.service';
import { addMoveSchema } from "../validators/move.validator";
import { AppError } from "../utils/appError";

export const addMove: RequestHandler = async (req, res) => {
    if (!req.user) throw new AppError('Unauthorized', 401);

    const data = addMoveSchema.parse(req.body);
    const move = await moveService.addMove({
        ...data,
        userId: req.user.id
    });

    res.status(201).json({ error: null, data: move });
}
