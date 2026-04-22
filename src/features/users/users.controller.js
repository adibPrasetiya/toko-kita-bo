import { NODE_ENV } from "../../core/config/app.constant.js";
import { extractIpAddress } from "../../utils/device.utils.js";
import usersService from "./users.service.js";

const login = async (req, res, next) => {
    try {
        const { username, password } = req.body || {};
        const userAgent = req.headers["user-agent"] || "unknown";
        const ipAddress = extractIpAddress(req);

        const result = await usersService.login(username, password, userAgent, ipAddress);
        res.status(200)
            .cookie("accessToken", result.data.accessToken, {
                httpOnly: true,
                secure: NODE_ENV === "prod",
                sameSite: NODE_ENV === "prod" ? "strict" : "lax",
                maxAge: 15 * 60 * 1000 // 15 menit
            })
            .cookie("refreshToken", result.data.refreshToken,  {
                httpOnly: true,
                secure: NODE_ENV === "prod",
                sameSite: NODE_ENV === "prod" ? "strict" : "lax",
                maxAge: 60 * 60 * 1000 // 1 jam
            })
            .json({
                message: result.message
            }).end();
    } catch (error) {
        next(error);
    }
}

const changePassword = async (req, res, next) => {
    try {
        const { newPassword, currentPassword } = req.body || {};
        const { username } = req.user;

        const result = await usersService.changePassword(currentPassword, newPassword, username);
        res.status(201).json({
            message: result.message
        }).end();
    } catch (error) {
        next(error);
    }
}

const logout = async (req, res, next) => {
    try {
        const { username } = req.user || {};
        const result = await usersService.logout(username);
        res.status(200)
            .clearCookie("accessToken", {
                httpOnly: true,
                secure: NODE_ENV === "prod",
                sameSite: NODE_ENV === "prod" ? "strict" : "lax",
            })
            .clearCookie("refreshToken", {
                httpOnly: true,
                secure: NODE_ENV === "prod",
                sameSite: NODE_ENV === "prod" ? "strict" : "lax",
            })
            .json({
                message: result.message
            }).end();
    } catch (error) {
        next(error);
    }
}

export default { login, changePassword, logout };