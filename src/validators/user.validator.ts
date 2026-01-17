import z from "zod";

export const registerUserSchema = z.object({
    name: z.string().min(2, 'Name required').max(255),
    email: z.email('email must be valid'),
    password: z.string().min(8, 'password must be greater then 8 characters')
})
