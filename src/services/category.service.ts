import { and, eq, isNull, sql } from "drizzle-orm";
import { db } from "../db/connection";
import { categories, NewCategory, products } from "../db/schema";
import { AppError } from "../utils/appError";

export const createCategory = async (data: NewCategory) => {
    const result = await db
        .insert(categories)
        .values(data)
        .returning();

    return result[0];
}

export const listCategories = async (includeProductCount: boolean = false) => {
    // list with includeProductCount
    if (includeProductCount) {
        const categoriesWithCount = await db
            .select({
                id: categories.id,
                name: categories.name,
                createdAt: categories.createdAt,
                productCount: sql<number>`count(${products.id})::int`
            })
            .from(categories)
            .leftJoin(products, eq(categories.id, products.categoryId))
            .where(isNull(categories.deletedAt))
            .groupBy(categories.id);

        return categoriesWithCount;
    }


    // list only categories
    const categoriesList = await db
        .select()
        .from(categories)
        .where(isNull(categories.deletedAt));
    return categoriesList;
}

export const updateCategory = async (id: string, data: NewCategory) => {
    const updateData = { ...data, updatedAt: new Date() };

    const result = await db
        .update(categories)
        .set(updateData)
        .where(eq(categories.id, id))
        .returning();

    if (!result[0]) return null;
    return result[0];
}

export const deleteCategory = async (id: string) => {
    const existingProducts = await db
        .select()
        .from(products)
        .where(and(eq(products.categoryId, id), isNull(products.deletedAt)));

    if (existingProducts[0]) throw new AppError('You cannot delete categories with products.', 400);

    const result = await db
        .update(categories)
        .set({ deletedAt: new Date() })
        .where(eq(categories.id, id))
        .returning();

    if (!result[0]) return null;
    return result[0];
}

// Helper functions
export const getCategoryById = async (id: string) => {
    const result = await db
        .select()
        .from(categories)
        .where(eq(categories.id, id))
        .limit(1);

    const category = result[0];
    if (!category || category.deletedAt) return null;
    return category;
}
