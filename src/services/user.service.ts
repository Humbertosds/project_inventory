import { eq } from "drizzle-orm";
import { db } from "../db/connection";
import { NewUser, User, users } from "../db/schema";
import bcrypt from 'bcrypt';
import { AppError } from "../utils/appError";
import crypto from 'crypto';

export const registerUser = async (data: NewUser) => {
    const existingUser = await getUserByEmail(data.email);
    if (existingUser) {
        throw new AppError('User already exist', 400);
    }

    const hashedPassword = await hashPassword(data.password);

    const newUser: NewUser = {
        ...data,
        password: hashedPassword
    };
    const result = await db.insert(users).values(newUser).returning();
    const user = result[0];

    return formatUser(user);
}

export const login = async (email: string, password: string) => {
    const user = await getUserByEmail(email);
    if (!user) return null;

    const isPasswordValid = verifyPassword(password, user.password);
    if (!isPasswordValid) return null;

    const token = crypto.randomBytes(32).toString('hex');

    await db
        .update(users)
        .set({ token, updatedAt: new Date() })
        .where(eq(users.id, user.id));

    const result = formatUser(user);
    return { ...result, token };
}

export const logout = async (token: string) => {
    await db
        .update(users)
        .set({ token: null, updatedAt: new Date() })
        .where(eq(users.token, token))
}

// Helpers functions
export const getUserByEmail = async (email: string) => {
    const result = await db
        .select()
        .from(users)
        .where(eq(users.email, email))
        .limit(1);

    const user = result[0];

    if (!user || user.deletedAt) return null;
    return user;
}

export const hashPassword = (password: string) => {
    return bcrypt.hashSync(password, 10);
}

export const verifyPassword = (password: string, hashPassword: string) => {
    return bcrypt.compareSync(password, hashPassword);
}

export const formatUser = (user: User) => {
    const { password, ...userWithoutPassword } = user;

    if (userWithoutPassword.avatar) {
        userWithoutPassword.avatar = `${process.env.BASE_URL}/static/avatars/${userWithoutPassword.avatar}`;
    }

    return userWithoutPassword;
}
