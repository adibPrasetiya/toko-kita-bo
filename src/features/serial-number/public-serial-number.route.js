import serialNumberController from "./serial-number.controller.js";

export const publicSerialNumberRoutes = [
  {
    path: "/serial-numbers/:serialNumberId",
    method: "get",
    handler: serialNumberController.check,
  },
  {
    path: "/serial-numbers/register",
    method: "post",
    handler: serialNumberController.register,
  },
];
