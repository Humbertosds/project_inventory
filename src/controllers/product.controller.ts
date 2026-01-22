import { RequestHandler } from "express";
import * as productService from '../services/product.service';
import { createProductSchema, getProductSchema, listProductsSchema, updateProductSchema } from "../validators/product.validator";
import { AppError } from "../utils/appError";

export const createProduct: RequestHandler = async (req, res) => {
    const data = createProductSchema.parse(req.body);
    const product = await productService.createProduct(data);

    res.status(201).json({ error: null, data: product });
}

export const listProducts: RequestHandler = async (req, res) => {
    const { offset, limit, search } = listProductsSchema.parse(req.query);
    const products = await productService.listProducts(offset, limit, search);

    res.status(200).json({ error: null, data: products });
}

export const getProduct: RequestHandler = async (req, res) => {
    const { id } = getProductSchema.parse(req.params);
    const product = await productService.getProductWithDetails(id);
    if (!product) throw new AppError('product not found', 404);

    res.status(200).json({ error: null, data: product });
}

export const updateProduct: RequestHandler = async (req, res) => {
    const { id } = getProductSchema.parse(req.params);
    const data = updateProductSchema.parse(req.body);
    const updatedProduct = await productService.updateProduct(id, data);
    if (!updatedProduct) throw new AppError('Product not found', 404);

    res.status(200).json({ error: null, data: updatedProduct });
}

export const deleteProduct: RequestHandler = async (req, res) => {
    const { id } = getProductSchema.parse(req.params);
    const deletedProduct = await productService.deleteProduct(id);
    if (!deletedProduct) throw new AppError('Product not found', 404);

    res.status(200).json({ error: null, data: null });
}
