import z, { coerce } from "zod";

const moveTypeEnum = z.enum(['in', 'out']);

export const addMoveSchema = z.object({
    productId: z.uuid('Format id invalid'),
    type: moveTypeEnum,
    quantity: z.coerce.number().min(1, 'Min quantity: 1').transform(String)
})

export const ListMovesSchema = z.object({
    productId: z.uuid('Format id invalid').optional(),
    offset: z.coerce.number().int().min(0, 'offset min: 0').optional().default(0),
    limit: z.coerce.number().int().min(1, 'limit min: 1').max(50, 'limit max: 50').optional().default(10)
})
export type ListMovesInput = z.infer<typeof ListMovesSchema>;
