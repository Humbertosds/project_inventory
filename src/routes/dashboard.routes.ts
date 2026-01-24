import { Router } from "express";
import * as dashboardController from '../controllers/dashboard.controller';

const router = Router();

// GET /api/dashboard/inventory-value - Get total inventory value
router.get('/inventory-value', dashboardController.getInventoryValue);

// GET /api/dashboard/moves-summary - Get total/count of IN and OUT moves (in gived period)
router.get('/moves-summary', dashboardController.getMovesSummary);

// GET /api/dashboard/moves-graph - Get data for dashboard graph (OUT moves only)
router.get('/moves-graph', dashboardController.getMovesGraph);

export default router;
