import usersController from "./users.controller.js";

export const userRoutes = [
    {
        path: "/users",
        method: "post",
        handler: usersController.login
    }
]