import { and, desc, eq, ilike, isNull, sql } from "drizzle-orm";
import { db } from "../db/connection";
import { categories, NewProduct, products } from "../db/schema";
import { AppError } from "../utils/appError";
import * as categoryService from './category.service';

export const createProduct = async (data: NewProduct) => {
    const category = await categoryService.getCategoryById(data.categoryId);
    if (!category) throw new AppError('Category not found', 404);

    const result = await db
        .insert(products)
        .values(data)
        .returning();

    if (!result[0]) return null;
    return result[0];
}

export const listProducts = async (offset: number = 0, limit: number = 10, search?: string) => {
    const whereSearch = search
        ? sql`${products.deletedAt} IS NULL AND ${ilike(products.name, `%${search}%`)}`
        : isNull(products.deletedAt)

    const productsList = await db
        .select({
            id: products.id,
            name: products.name,
            categoryId: products.categoryId,
            categoryName: categories.name,
            unitPrice: products.unitPrice,
            unitType: products.unitType,
            quantity: products.quantity,
            minimumQuantity: products.minimumQuantity,
            maximumQuantity: products.maximumQuantity,
            createdAt: products.createdAt,
            updatedAt: products.updatedAt
        })
        .from(products)
        .where(whereSearch)
        .leftJoin(categories, eq(products.categoryId, categories.id))
        .offset(offset)
        .limit(limit)
        .orderBy(desc(products.createdAt))

    return productsList;
}

export const getProductWithDetails = async (id: string) => {
    const result = await db
        .select({
            id: products.id,
            name: products.name,
            categoryId: products.categoryId,
            categoryName: categories.name,
            unitPrice: products.unitPrice,
            unitType: products.unitType,
            quantity: products.quantity,
            minimumQuantity: products.minimumQuantity,
            maximumQuantity: products.maximumQuantity,
            createdAt: products.createdAt,
            updatedAt: products.updatedAt
        })
        .from(products)
        .where(and(eq(products.id, id), isNull(products.deletedAt)))
        .leftJoin(categories, eq(products.categoryId, categories.id))
        .limit(1);

    if (!result[0]) return null;
    return result[0];
}

export const updateProduct = async (id: string, data: Partial<NewProduct>) => {
    if (data.categoryId) {
        const category = await categoryService.getCategoryById(id);
        if (!category) throw new AppError('Category not found', 404);
    }

    const updateData = { ...data, updatedAt: new Date() };

    const result = await db
        .update(products)
        .set(updateData)
        .where(and(eq(products.id, id), isNull(products.deletedAt)))
        .returning();

    if (!result[0]) return null;
    return result[0];
}

export const deleteProduct = async (id: string) => {
    const result = await db
        .update(products)
        .set({ deletedAt: new Date() })
        .where(eq(products.id, id))
        .returning();

    if (!result[0]) return null;
    return result[0];
}
