import crypto from "crypto";
import { prismaClient } from "../../core/lib/database.lib.js";
import { compare, hash } from "../../core/lib/password.lib.js";
import { BadRequestError } from "../../error/bad-request.error.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../../utils/token.utils.js";
import { validate } from "../../utils/validator.utils.js";
import {
  changePasswordSchema,
  loginSchema,
  refreshTokenSchema,
  usernameSchema,
} from "./user.validation.js";
import { generateDeviceId, parseDeviceName } from "../../utils/device.utils.js";
import {
  checkPasswordIsValid,
  checkUserIsExist,
} from "../../utils/user.utils.js";
import { UnauthorizedError } from "../../error/unathorized.error.js";

const login = async (username, password, userAgent, ipAddress) => {
  const validateInput = validate(loginSchema, { username, password });

  const isUsernameValid = await prismaClient.users.findUnique({
    where: {
      username: validateInput.username,
    },
  });

  if (!isUsernameValid) {
    throw new BadRequestError("Username atau password salah");
  }

  if (!isUsernameValid.isActive) {
    throw new BadRequestError("Akun tidak aktif. Hubungi admin!");
  }

  await checkPasswordIsValid(validateInput.password, isUsernameValid.password);

  const accessToken = generateAccessToken(isUsernameValid.username);
  const refreshToken = generateRefreshToken(isUsernameValid.username);

  const hashedRefreshToken = crypto
    .createHash("sha256")
    .update(refreshToken)
    .digest("hex");

  const deviceId = generateDeviceId(userAgent);
  const deviceName = parseDeviceName(userAgent);
  const expiresAt = new Date();

  await prismaClient.session.upsert({
    where: { userId: username },
    update: {
      refreshToken: hashedRefreshToken,
      deviceId,
      deviceName,
      userAgent,
      ipAddress,
      expiresAt,
    },
    create: {
      userId: username,
      refreshToken: hashedRefreshToken,
      deviceId,
      deviceName,
      userAgent,
      ipAddress,
      expiresAt,
    },
  });

  return {
    message: "Login berhasil",
    data: {
      accessToken,
      refreshToken,
    },
  };
};

const changePassword = async (currentPassword, newPassword, username) => {
  const validateInput = validate(changePasswordSchema, {
    username,
    newPassword,
    currentPassword,
  });

  const user = await checkUserIsExist(validateInput.username);

  await checkPasswordIsValid(validateInput.currentPassword, user.password);

  const hashedNewPassword = await hash(validateInput.newPassword);

  await prismaClient.users.update({
    where: {
      username: validateInput.username,
    },
    data: {
      password: hashedNewPassword,
    },
  });

  return {
    message: "Password berhasil diperbarui",
  };
};

const refreshToken = async (refreshToken) => {
  const validateInput = validate(refreshTokenSchema, refreshToken);
  let decoded;
  try {
    decoded = verifyRefreshToken(refreshToken);
  } catch {
    throw new UnauthorizedError(
      "Refresh token tidak valid atau sudah kadaluarsa.",
    );
  }

  const username = decoded.sub;

  const session = await prismaClient.session.findUnique({
    where: {
      userId: username,
    },
  });

  if (!session) {
    throw new UnauthorizedError("Sesi tidak ditemukan. Silakan login kembali.");
  }

  if (new Date() > session.expiresAt) {
    await prismaClient.session.delete({ where: { userId: username } });
    throw new UnauthorizedError(
      "Sesi sudah kadaluarsa. Silakan login kembali.",
    );
  }

  const hashedIncoming = crypto
    .createHash("sha256")
    .update(refreshToken)
    .digest("hex");

  if (hashedIncoming !== session.refreshToken) {
    throw new UnauthorizedError("Refresh token tidak valid.");
  }
};

const logout = async (username) => {
  const validateInput = validate(usernameSchema, username);
  const user = await checkUserIsExist(validateInput);

  await prismaClient.session.delete({
    where: {
      userId: user.username,
    },
  });

  return {
    message: "Berhasil logout",
  };
};

export default { login, changePassword, logout };
