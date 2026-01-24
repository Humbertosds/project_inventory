import { RequestHandler } from "express";
import * as dashboardService from '../services/dashboard.service';
import { getMovesSummarySchema } from "../validators/dashboard.validator";

export const getInventoryValue: RequestHandler = async (req, res) => {
    const totalValue = await dashboardService.getInventoryValue();

    res.status(200).json({ error: null, data: { totalValue } })
}

export const getMovesSummary: RequestHandler = async (req, res) => {
    const query = getMovesSummarySchema.parse(req.query);
    const summary = await dashboardService.getMovesSummary(query);

    res.status(200).json({ error: null, data: { summary } })
}

export const getMovesGraph: RequestHandler = async (req, res) => {
    const query = getMovesSummarySchema.parse(req.query);
    const graph = await dashboardService.getMovesGraph(query);

    res.status(200).json({ error: null, data: graph })
}
