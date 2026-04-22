import { app } from "./core/app/app.js";
import { APP_PORT } from "./core/config/app.constant.js";

app.listen(APP_PORT || 3000, () => {
    console.log(`SERVER RUNNING ON PORT ${APP_PORT || 3000}`);
});