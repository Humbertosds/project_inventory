import z from "zod";

export const authLoginSchema = z.object({
    email: z.email('E-mail must be valid'),
    password: z.string('password is required').min(8, 'password must be greater than or equal to 8 characters')
})
