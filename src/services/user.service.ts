import { eq, isNull } from "drizzle-orm";
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

export const listUsers = async (offset: number = 0, limit: number = 10) => {
    const usersList = await db
        .select()
        .from(users)
        .where(isNull(users.deletedAt))
        .offset(offset)
        .limit(limit);

    return usersList.map(formatUser);
}

export const updateUser = async (id: string, data: Partial<NewUser>) => {
    const user = await getUserById(id);
    if (!user) throw new AppError('User not found', 404);

    if (data.email && data.email !== user.email) {
        const emailInUse = await getUserByEmail(data.email, true);
        if (emailInUse) throw new AppError('Email already in use', 400);
    }

    const updateData: Partial<NewUser> = { ...data };

    if (data.password) {
        updateData.password = hashPassword(data.password);
    }

    // TODO: handle avatar;

    updateData.updatedAt = new Date();

    const result = await db
        .update(users)
        .set(updateData)
        .where(eq(users.id, id))
        .returning();

    const updatedUser = result[0];
    if (!updatedUser) return null;

    return formatUser(updatedUser);
}

export const deleteUser = async (id: string) => {
    const result = await db
        .update(users)
        .set({ deletedAt: new Date() })
        .where(eq(users.id, id))
        .returning();

    return result[0] ?? null;
}

// Helpers functions
export const getUserByEmail = async (email: string, includeDeleted: boolean = false) => {
    const result = await db
        .select()
        .from(users)
        .where(eq(users.email, email))
        .limit(1);

    const user = result[0];

    if (!user) return null;
    if (user && user.deletedAt && includeDeleted === false) return null;

    return user;
}

export const getUserById = async (id: string) => {
    const result = await db
        .select()
        .from(users)
        .where(eq(users.id, id))
        .limit(1);

    const user = result[0];
    if (!user || user.deletedAt) return null;
    return user;
}

export const getUserByIdPublic = async (id: string) => {
    const user = await getUserById(id);
    if (!user) return null;

    return formatUser(user);
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

    const { id, name, email, avatar, isAdmin } = userWithoutPassword;

    return { id, name, email, avatar, isAdmin };
}

export const validateToken = async (token: string) => {
    const result = await db
        .select()
        .from(users)
        .where(eq(users.token, token))
        .limit(1);

    const user = result[0];
    if (!user || user.deletedAt) return null;

    return user;
}
