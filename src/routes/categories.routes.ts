import { Router } from "express";
import * as categoriesController from '../controllers/category.controller';

const router = Router();

// POST /api/categories - Create a new category;
router.post('/', categoriesController.createCategory);

// GET /api/categories - Get all categories (with includeProductCount flag);
router.get('/', categoriesController.listCategories);

// GET /api/categories/:id - Get one Category;
// possible improvement: return number of products in the category
router.get('/:id', categoriesController.getCategory);

// PUT /api/categories/:id - Update a category by id;
router.put('/:id', categoriesController.updateCategory);

// DELETE api/categories/:id - Delete a category by id;
router.delete('/:id', categoriesController.deleteCategory);

export default router;
