import z from "zod";

export const getMovesSummarySchema = z.object({
    startDate: z.string().refine(val => !isNaN(Date.parse(val)), 'Invalid Date').optional(),
    endDate: z.string().refine(val => !isNaN(Date.parse(val)), 'Invalid Date').optional()
});
export type DateRangeInput = z.infer<typeof getMovesSummarySchema>;
