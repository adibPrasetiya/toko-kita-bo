import Joi from "joi";

const createBulkSerialNumberSchema = Joi.number()
  .max(100)
  .min(1)
  .positive()
  .default(10)
  .required()
  .messages({
    "number.base": "Jumlah harus berupa angka",
    "number.min": "Jumlah minimal 1",
    "number.max": "Jumlah maksimal 100",
    "number.positive": "Jumlah harus bernilai positif",
    "any.required": "Jumlah wajib diisi",
  });

const serialNumberSchema = Joi.string()
  .length(8)
  .pattern(/^[A-Z0-9]+$/)
  .required()
  .messages({
    "string.base": "Serial number harus berupa teks",
    "string.empty": "Serial number tidak boleh kosong",
    "string.length": "Serial number harus tepat 16 karakter",
    "string.pattern.base": "Serial number hanya boleh huruf besar dan angka",
    "any.required": "Serial number wajib diisi",
  });

const searchSerialNumberSchema = Joi.object({
  serialNumberId: Joi.string().max(8).optional().messages({
    "string.base": "Serial number harus berupa teks",
    "string.empty": "Serial number tidak boleh kosong",
    "string.max": "Serial number maksimal 8 karakter",
  }),

  isActivate: Joi.boolean().optional().messages({
    "boolean.base": "isActive harus berupa boolean (true/false)",
  }),

  page: Joi.number().integer().min(1).default(1).messages({
    "number.base": "Page harus berupa angka",
    "number.integer": "Page harus berupa bilangan bulat",
    "number.min": "Page minimal 1",
  }),

  limit: Joi.number().integer().min(1).max(100).default(10).messages({
    "number.base": "Limit harus berupa angka",
    "number.integer": "Limit harus berupa bilangan bulat",
    "number.min": "Limit minimal 1",
    "number.max": "Limit maksimal 100",
  }),
});

const registerDeviceSchema = Joi.object({
  serialNumberId: Joi.string()
    .length(8)
    .pattern(/^[A-Z0-9]+$/)
    .required()
    .messages({
      "string.base": "Serial number harus berupa teks",
      "string.empty": "Serial number tidak boleh kosong",
      "string.length": "Serial number harus tepat 8 karakter",
      "string.pattern.base": "Serial number hanya boleh huruf besar dan angka",
      "any.required": "Serial number wajib diisi",
    }),

  clientName: Joi.string().max(255).required().messages({
    "string.base": "Nama klien harus berupa teks",
    "string.empty": "Nama klien tidak boleh kosong",
    "string.max": "Nama klien maksimal 255 karakter",
    "any.required": "Nama klien wajib diisi",
  }),

  clientPhoneNumber: Joi.string()
    .max(20)
    .pattern(/^[0-9+\-\s()]+$/)
    .required()
    .messages({
      "string.base": "Nomor telepon harus berupa teks",
      "string.empty": "Nomor telepon tidak boleh kosong",
      "string.max": "Nomor telepon maksimal 20 karakter",
      "string.pattern.base": "Nomor telepon tidak valid",
      "any.required": "Nomor telepon wajib diisi",
    }),

  shopName: Joi.string().max(255).required().messages({
    "string.base": "Nama toko harus berupa teks",
    "string.empty": "Nama toko tidak boleh kosong",
    "string.max": "Nama toko maksimal 255 karakter",
    "any.required": "Nama toko wajib diisi",
  }),

  deviceId: Joi.string().max(255).required().messages({
    "string.base": "Device ID harus berupa teks",
    "string.empty": "Device ID tidak boleh kosong",
    "string.max": "Device ID maksimal 255 karakter",
    "any.required": "Device ID wajib diisi",
  }),
});

const setStatusSchema = Joi.object({
  serialNumberId: Joi.string()
    .length(8)
    .pattern(/^[A-Z0-9]+$/)
    .required()
    .messages({
      "string.base": "Serial number harus berupa teks",
      "string.empty": "Serial number tidak boleh kosong",
      "string.length": "Serial number harus tepat 8 karakter",
      "string.pattern.base": "Serial number hanya boleh huruf besar dan angka",
      "any.required": "Serial number wajib diisi",
    }),

  status: Joi.string()
    .valid("AVAILABLE", "SELL", "SOLD", "DEMO")
    .optional()
    .messages({
      "string.base": "Status harus berupa teks",
      "any.only": "Status hanya boleh AVAILABLE, SELL, atau SOLD, DEMO",
    }),

  notes: Joi.string().max(255).optional().messages({
    "string.base": "Notes harus berupa teks",
    "string.max": "Notes maksimal 255 karakter",
  }),
})
  .or("status", "notes")
  .messages({
    "object.missing": "Minimal harus mengisi status atau notes",
  });

export {
  serialNumberSchema,
  createBulkSerialNumberSchema,
  searchSerialNumberSchema,
  registerDeviceSchema,
  setStatusSchema,
};
