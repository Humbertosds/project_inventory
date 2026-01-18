import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { AppError } from "../utils/appError";

export const globalErrorHandler = async (
    error: Error,
    req: Request,
    res: Response,
    next: NextFunction
) => {

    if (error instanceof AppError) {
        res.status(error.statusCode).json({
            error: error.message,
            data: null
        });
        return;
    }

    if (error instanceof ZodError) {
        const errorMessage = error.issues.map(e => e.message).join(', ');
        res.status(400).json({ error: errorMessage, data: null });
        return;
    }

    console.error('Error: ', error);
    res.status(500).json({
        error: 'Erro interno do servidor',
        data: null
    });
}
