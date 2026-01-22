import { Router } from "express";
import * as moveController from '../controllers/move.controller';

const router = Router();

router.post('/', moveController.addMove);

export default router;
