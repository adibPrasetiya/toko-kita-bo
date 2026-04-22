import Joi from "joi";

const loginSchema = Joi.object({
  username: Joi.string().required().messages({
    "string.empty": "Username tidak boleh kosong",
    "any.required": "Username wajib diisi",
  }),

  password: Joi.string().required().messages({
    "string.empty": "Password tidak boleh kosong",
    "any.required": "Password wajib diisi",
  }),
});

const changePasswordSchema = Joi.object({
  username: Joi.string().min(3).max(50).required().messages({
    "string.empty": "Username tidak boleh kosong",
    "string.min": "Username minimal 3 karakter",
    "string.max": "Username maksimal 50 karakter",
    "any.required": "Username wajib diisi",
  }),

  currentPassword: Joi.string().min(6).required().messages({
    "string.empty": "Password lama tidak boleh kosong",
    "string.min": "Password lama minimal 6 karakter",
    "any.required": "Password lama wajib diisi",
  }),

  newPassword: Joi.string()
    .min(8)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/)
    .required()
    .messages({
      "string.empty": "Password baru tidak boleh kosong",
      "string.min": "Password baru minimal 8 karakter",
      "string.pattern.base":
        "Password baru harus mengandung huruf besar, huruf kecil, dan angka",
      "any.required": "Password baru wajib diisi",
    }),
});

const usernameSchema = Joi.string().required().messages({
  "string.empty": "Username tidak boleh kosong",
  "any.required": "Username wajib diisi",
});

const refreshTokenSchema = Joi.string()
  .required()
  .max(2048)
  .pattern(/^[A-Za-z0-9\-_]+\.[A-Za-z0-9\-_]+\.[A-Za-z0-9\-_]+$/)
  .messages({
    "string.empty": "Refresh token tidak boleh kosong",
    "any.required": "Refresh token tidak ditemukan",
    "string.max": "Refresh token tidak valid",
    "string.pattern.base": "Format refresh token tidak valid",
  });

export {
  loginSchema,
  changePasswordSchema,
  usernameSchema,
  refreshTokenSchema,
};
