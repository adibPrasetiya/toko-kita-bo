import { prismaClient } from "../core/lib/database.lib.js"
import { compare } from "../core/lib/password.lib.js";
import { BadRequestError } from "../error/bad-request.error.js";
import { NotFoundError } from "../error/not-found.error.js";

export const checkUserIsExist = async (username) => {
    const user = await prismaClient.users.findUnique({
        where: {
            username: username
        }
    });

    if(!user) {
        throw new NotFoundError("User tidak ditemukan");
    }

    return user;
}

export const checkPasswordIsValid = async (password, hashedPassword) => {
    const isPasswordValid = await compare(password, hashedPassword);

    if(!isPasswordValid) {
        throw new BadRequestError("Username atau password salah");
    }
}