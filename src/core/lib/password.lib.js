import crypto from "crypto";
import { promisify } from "util";
import { KEY_LENGTH, PASSWORD_ITERATIONS, SALT_LENGTH } from "../config/app.constant.js";


const pbkdf2Async = promisify(crypto.pbkdf2);

const hash = async (password) => {
  const salt = crypto.randomBytes(SALT_LENGTH);

  const derivedKey = await pbkdf2Async(
    password,
    salt,
    PASSWORD_ITERATIONS,
    KEY_LENGTH,
    "sha512",
  );

  const saltBase64 = salt.toString("base64");
  const hashBase64 = derivedKey.toString("base64");

  return `${saltBase64}.${hashBase64}`;
};

const compare = async (password, hashedPassword) => {
  if (!hashedPassword) {
    return false;
  }

  const parts = hashedPassword.split(".");
  if (parts.length !== 2) {
    return false;
  }

  const salt = Buffer.from(parts[0], "base64");
  const storedHash = Buffer.from(parts[1], "base64");

  try {
    const derivedKey = await pbkdf2Async(
      password,
      salt,
      PASSWORD_ITERATIONS,
      KEY_LENGTH,
      "sha512",
    );

    return crypto.timingSafeEqual(derivedKey, storedHash);
  } catch (error) {
    return false;
  }
};

export { hash, compare };
