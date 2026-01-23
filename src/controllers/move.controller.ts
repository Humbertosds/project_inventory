import { RequestHandler } from "express";
import * as moveService from '../services/move.service';
import { addMoveSchema, ListMovesSchema } from "../validators/move.validator";
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

export const ListMoves: RequestHandler = async (req, res) => {
    const data = ListMovesSchema.parse(req.query);
    const moves = await moveService.listMoves(data);

    res.status(200).json({ error: null, data: moves })
}
