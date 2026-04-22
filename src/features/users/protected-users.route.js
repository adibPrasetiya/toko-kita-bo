import usersController from "./users.controller.js";

export const protectedUserRoutes = [
    {
        path: "/users",
        method: "patch",
        handler: usersController.changePassword
    },
    {
        path: "/users",
        method: "delete",
        handler: usersController.logout
    }
];