import jwt from "jsonwebtoken";
import { ACCESS_TOKEN_EXPIRY, ACCESS_TOKEN_SECRET, REFRESH_TOKEN_EXPIRY_DAYS, REFRESH_TOKEN_SECRET } from "../core/config/app.constant.js";
import { privateKey, publicKey } from "../core/config/jwt-key.constant.js";

const generateAccessToken = (username, expiry = ACCESS_TOKEN_EXPIRY) => {
    return jwt.sign({ sub: username }, ACCESS_TOKEN_SECRET, { expiresIn: expiry });
}

const verifyAccessToken = (token) => jwt.verify(token, ACCESS_TOKEN_SECRET);

const generateRefreshToken = (userId, expiryDays = REFRESH_TOKEN_EXPIRY_DAYS) => {
    return jwt.sign({ sub: userId }, REFRESH_TOKEN_SECRET, { expiresIn: `${expiryDays}d` });
}

const verifyRefreshToken = (token) => jwt.verify(token, REFRESH_TOKEN_SECRET);

const generateLicenseToken = ({ serialNumberId, deviceId, clientName, shopName }) => {
    return jwt.sign(
        { serialNumberId, clientName, shopName },
        privateKey,
        { algorithm: "RS256", subject: deviceId }
    );
};

const verifyLicenseToken = (token) => jwt.verify(token, publicKey, { algorithms: ["RS256"] });

export {
    generateAccessToken,
    generateRefreshToken,
    verifyAccessToken,
    verifyRefreshToken,
    generateLicenseToken,
    verifyLicenseToken,
}