import serialNumberService from "./serial-number.service.js";

const createBulk = async (req, res, next) => {
  try {
    const { number } = req.body || {};
    const result = await serialNumberService.createBulk(number);
    res.status(200).json({ message: result.message, data: result.data }).end();
  } catch (error) {
    next(error);
  }
};

const search = async (req, res, next) => {
  try {
    const { serialNumberId, isActivate, page, limit } = req.query || {};
    const result = await serialNumberService.search(
      serialNumberId,
      isActivate,
      page,
      limit,
    );
    res
      .status(200)
      .json({
        message: result.message,
        data: result.data,
        pagination: result.pagination,
      })
      .end();
  } catch (error) {
    next(error);
  }
};

const check = async (req, res, next) => {
  try {
    const { serialNumberId } = req.params;
    const result = await serialNumberService.check(serialNumberId);
    res
      .status(200)
      .json({
        message: result.message,
        data: result.data,
      })
      .end();
  } catch (error) {
    next(error);
  }
};

const register = async (req, res, next) => {
  try {
    const result = await serialNumberService.register(req.body);
    res
      .status(201)
      .json({ message: result.message, licenseToken: result.licenseToken })
      .end();
  } catch (error) {
    next(error);
  }
};

const reset = async (req, res, next) => {
  try {
    const { serialNumberId } = req.params;
    const result = await serialNumberService.reset(serialNumberId);
    res
      .status(200)
      .json({
        message: result.message,
      })
      .end();
  } catch (error) {
    next(error);
  }
};

const setStatus = async (req, res, next) => {
  try {
    const reqBody = req.body;
    const { serialNumberId } = req.params;

    const result = await serialNumberService.setStatus(reqBody, serialNumberId);
    res
      .status(200)
      .json({
        message: result.message,
        data: result.data,
      })
      .end();
  } catch (error) {
    next(error);
  }
};

export default { createBulk, search, check, register, reset, setStatus };
