import { prismaClient } from "../../core/lib/database.lib.js";
import { BadRequestError } from "../../error/bad-request.error.js";
import { NotFoundError } from "../../error/not-found.error.js";
import { UnauthorizedError } from "../../error/unathorized.error.js";
import { generateSerialNumber } from "../../utils/serial-number.utils.js";
import { generateLicenseToken } from "../../utils/token.utils.js";
import { validate } from "../../utils/validator.utils.js";
import {
  createBulkSerialNumberSchema,
  registerDeviceSchema,
  searchSerialNumberSchema,
  serialNumberSchema,
  setStatusSchema,
} from "./serial-number.validation.js";

const createBulk = async (number = 10) => {
  number = validate(createBulkSerialNumberSchema, number);

  const serialNumbers = new Set();
  while (serialNumbers.size < number) {
    serialNumbers.add(generateSerialNumber());
  }

  const serialNumberArrays = Array.from(serialNumbers);

  const existings = await prismaClient.serialNumbers.findMany({
    where: {
      serialNumberId: { in: serialNumberArrays },
    },
    select: {
      serialNumberId: true,
    },
  });

  const existingSerialNumbers = new Set(existings.map((e) => e.serialNumberId));

  let finalSerialNumbers = serialNumberArrays.filter(
    (sn) => !existingSerialNumbers.has(sn),
  );

  await prismaClient.serialNumbers.createMany({
    data: finalSerialNumbers.map((sn) => ({
      serialNumberId: sn,
    })),
    skipDuplicates: true,
  });

  return {
    message: `Berhasil menambahkan ${finalSerialNumbers.length} serial number baru`,
  };
};

const search = async (serialNumberId, isActivate, page, limit) => {
  const validateInput = validate(searchSerialNumberSchema, {
    serialNumberId,
    isActivate,
    page,
    limit,
  });

  const where = {};

  if (validateInput.serialNumberId) {
    where.serialNumberId = {
      contains: validateInput.serialNumberId.toUpperCase(),
    };
  }

  if (validateInput.isActivate !== undefined) {
    where.isActivate = validateInput.isActivate;
  }

  const skip = (validateInput.page - 1) * validateInput.limit;

  const [totalItems, serialNumbers] = await Promise.all([
    prismaClient.serialNumbers.count({ where }),
    prismaClient.serialNumbers.findMany({
      where,
      skip,
      take: validateInput.limit,
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const totalPages = Math.ceil(totalItems / validateInput.limit);

  return {
    message: "Data serial number ditemukan",
    data: serialNumbers,
    pagination: {
      page: validateInput.page,
      limit: validateInput.limit,
      totalItems,
      totalPages,
    },
  };
};

const check = async (serialNumberId) => {
  const validateInput = validate(serialNumberSchema, serialNumberId);

  const serialNumber = await prismaClient.serialNumbers.findUnique({
    where: {
      serialNumberId: serialNumberId,
    },
  });

  if (!serialNumber) {
    throw new NotFoundError("Serial number tidak ditemukan");
  }

  if (serialNumber.isActivate) {
    throw new BadRequestError("Serial number sudah digunakan");
  }

  return {
    message: "Serial number tersedia",
    data: {
      serialNumber: serialNumber.serialNumberId,
      isAvailable: true,
      createdAt: serialNumber.createdAt,
    },
  };
};

const register = async (body) => {
  const validateInput = validate(registerDeviceSchema, body);

  const serialNumber = await prismaClient.serialNumbers.findUnique({
    where: { serialNumberId: validateInput.serialNumberId },
  });

  if (!serialNumber) {
    throw new NotFoundError("Serial number tidak ditemukan");
  }

  if (serialNumber.isActivate) {
    throw new BadRequestError("Serial number sudah digunakan");
  }

  const existingDevice = await prismaClient.serialNumbers.findUnique({
    where: { deviceId: validateInput.deviceId },
  });

  if (existingDevice) {
    throw new BadRequestError("Device sudah terdaftar");
  }

  await prismaClient.serialNumbers.update({
    where: { serialNumberId: validateInput.serialNumberId },
    data: {
      clientName: validateInput.clientName,
      clientPhoneNumber: validateInput.clientPhoneNumber,
      shopName: validateInput.shopName,
      deviceId: validateInput.deviceId,
      isActivate: true,
    },
  });

  const licenseToken = generateLicenseToken({
    serialNumberId: validateInput.serialNumberId,
    deviceId: validateInput.deviceId,
    clientName: validateInput.clientName,
    shopName: validateInput.shopName,
  });

  return {
    message: "Registrasi device berhasil",
    licenseToken,
  };
};

const reset = async (serialNumberId) => {
  const validateInput = validate(serialNumberSchema, serialNumberId);

  const serialNumber = await prismaClient.serialNumbers.findUnique({
    where: {
      serialNumberId: serialNumberId,
    },
  });

  if (!serialNumber) {
    throw new NotFoundError("Serial number tidak ditemukan");
  }

  if (!serialNumber.isActivate) {
    throw new BadRequestError(
      "Gagal mereset serial number. Serial number masih tersedia",
    );
  }

  await prismaClient.serialNumbers.update({
    where: {
      serialNumberId: serialNumberId,
    },
    data: {
      deviceId: null,
      isActivate: false,
      clientName: null,
      clientPhoneNumber: null,
      shopName: null,
    },
  });

  return {
    message: "Serial number berhasil di reset",
  };
};

const setStatus = async (body, serialNumberId) => {
  body.serialNumberId = serialNumberId;
  body = validate(setStatusSchema, body);

  const serialNumber = await prismaClient.serialNumbers.findUnique({
    where: {
      serialNumberId: serialNumberId,
    },
  });

  if (!serialNumber) {
    throw new NotFoundError("Serial number tidak ditemukan");
  }

  const updatedData = {};

  if (body.status) {
    updatedData.status = body.status;
  }

  if (body.notes) {
    updatedData.notes = body.notes;
  }

  const update = await prismaClient.serialNumbers.update({
    where: {
      serialNumberId: serialNumberId,
    },
    data: updatedData,
  });

  return {
    message: "Status serial number berhasil di perbarui",
    data: update,
  };
};

export default { createBulk, search, check, register, reset, setStatus };
