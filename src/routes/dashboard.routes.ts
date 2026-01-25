import { Router } from "express";
import * as dashboardController from '../controllers/dashboard.controller';

const router = Router();

// GET /api/dashboard/inventory-value - Get total inventory value
router.get('/inventory-value', dashboardController.getInventoryValue);

// GET /api/dashboard/moves-summary - Get total/count of IN and OUT moves (in gived period)
router.get('/moves-summary', dashboardController.getMovesSummary);

// GET /api/dashboard/moves-graph - Get data for dashboard graph (OUT moves only)
router.get('/moves-graph', dashboardController.getMovesGraph);

// GET /api/dashboard/low-stock - Get products with low inventory
router.get('/low-stock', dashboardController.getLowStockProducts);

// GET /api/dashboard/high-stock - Get products with high inventory
router.get('/high-stock', dashboardController.getHighStockProducts);

// GET /api/dashboard/stagnant-products - Get prodocts that havent had OUT moves in a given period
router.get('/stagnant-products', dashboardController.getStagnantProducts);

export default router;
