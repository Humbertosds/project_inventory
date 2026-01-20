import multer from "multer";
import { Request } from "express";

const storage = multer.memoryStorage();

const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    const allowedFiles = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

    if (allowedFiles.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('incompatible file'))
    }
}

export const uploadAvatar = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB
    }
}).single('avatar');
