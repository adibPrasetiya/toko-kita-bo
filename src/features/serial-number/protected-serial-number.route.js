import serialNumberController from "./serial-number.controller.js";

export const protectedSerialNumberRoutes = [
  {
    path: "/serial-numbers",
    method: "post",
    handler: serialNumberController.createBulk,
  },
  {
    path: "/serial-numbers",
    method: "get",
    handler: serialNumberController.search,
  },
  {
    path: "/serial-numbers/:serialNumberId/reset",
    method: "patch",
    handler: serialNumberController.reset,
  },
  {
    path: "/serial-numbers/:serialNumberId/set",
    method: "patch",
    handler: serialNumberController.setStatus,
  },
];
