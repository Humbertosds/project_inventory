import z from "zod";

const moveTypeEnum = z.enum(['in', 'out']);

export const addMoveSchema = z.object({
    productId: z.uuid('Format id invalid'),
    type: moveTypeEnum,
    quantity: z.coerce.number().min(1, 'Min quantity: 1').transform(String)
})
