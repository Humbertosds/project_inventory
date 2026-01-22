import z from "zod";

export const createCategorySchema = z.object({
    name: z.string('Name required').min(2, 'name must be greater than or equal to 2 characters').max(255)
})

export const listCategoriesSchema = z.object({
    includeProductCount: z.coerce.boolean().optional().default(false)
})

export const categoryIdSchema = z.object({
    id: z.uuid('Id format invalid')
})

export const updateCategorySchema = z.object({
    name: z.string('Name required').min(2, 'name must be greater than or equal to 2 characters').max(255)
})
