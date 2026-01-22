import { Router } from "express";
import * as productController from '../controllers/product.controller';

const router = Router();

// POST /api/products - Create a product;
router.post('/', productController.createProduct);

// GET /api/products - List all produts (with pagination and searchProduct);
router.get('/', productController.listProducts);

// GET /api/products/:id - Get a product by id;
router.get('/:id', productController.getProduct);

// PUT /api/products/:id - Update a product by id;
router.put('/:id', productController.updateProduct);

// DELETE /api/products/:id - Delelte a product by id;
router.delete('/:id', productController.deleteProduct);

export default router;
