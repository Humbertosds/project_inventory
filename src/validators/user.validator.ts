import z from "zod";

export const registerUserSchema = z.object({
    name: z.string().min(2, 'Name required').max(255),
    email: z.email('email must be valid'),
    password: z.string().min(8, 'password must be greater than 8 characters')
});

export const listUsersSchema = z.object({
    offset: z.coerce.number().int().min(0).optional().default(0),
    limit: z.coerce.number().int().min(1).max(50, 'Max limit 50 per page').optional().default(10)
});

export const userIdSchema = z.object({
    id: z.uuid('Format id invalid')
});

export const updateUserSchema = z.object({
    name: z.string().min(2, 'Name too short').max(255).optional(),
    email: z.email('Email format invalid').optional(),
    password: z.string().min(8, 'password must be greater than or equal to 8 characters').optional(),
    avatar: z.string().nullable().optional()
});
