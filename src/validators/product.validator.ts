import z from "zod";

const unitTypeEnum = z.enum(['kg', 'g', 'l', 'ml', 'un']);

export const createProductSchema = z.object({
    name: z.string('Name required').min(2, 'too short').max(255),
    categoryId: z.uuid('Format id invalid'),
    unitPrice: z.coerce.number('unit price required').int().min(0, 'unit price min 0'),
    unitType: unitTypeEnum.default('un'),
    quantity: z.coerce.number().min(0, 'min quantity: 0').default(0).transform(String),
    minimumQuantity: z.coerce.number().min(0, 'min quantity: 0').default(0).transform(String),
    maximumQuantity: z.coerce.number().min(0, 'min quantity: 0').default(0).transform(String)
}).refine((data) => parseFloat(data.maximumQuantity) >= parseFloat(data.minimumQuantity), {
    message: 'maximumQuantity must be greater than or equal to minimumQuantity',
    path: ['maximumQuantity']
});

export const listProductsSchema = z.object({
    offset: z.coerce.number().int().min(0, 'offset cannot be lower than 0').optional().default(0),
    limit: z.coerce.number().int().min(1, 'limit cannot be lower than 1').max(30, 'limit cannot be greater than 30').optional().default(10),
    search: z.string().min(1, 'search too short').optional()
})

export const getProductSchema = z.object({
    id: z.uuid('Format id invalid')
})

export const updateProductSchema = z.object({
    name: z.string().min(2, 'too short').max(255).optional(),
    categoryId: z.uuid('Format id invalid').optional(),
    unitPrice: z.coerce.number().int().min(0, 'unit price min 0').optional(),
    unitType: unitTypeEnum.optional(),
    quantity: z.coerce.number().min(0, 'min quantity: 0').optional().default(0).transform(String),
    minimumQuantity: z.coerce.number().min(0, 'min quantity: 0').optional().default(0).transform(String),
    maximumQuantity: z.coerce.number().min(0, 'min quantity: 0').optional().default(0).transform(String)
})
