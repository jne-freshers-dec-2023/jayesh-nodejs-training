import express from "express";
import { DataSource } from "typeorm";
import { Post } from "./entities/Post";
import { User } from "./entities/User";
// import { isAuth } from "./middleware/is-auth";
const app = express();
const port = 3000;
const connectDB = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST,
    username: "postgres",
    password: "postgres",
    database: process.env.DB_DATABASE,
    port: parseInt(process.env.DB_PORT || "5432"),
    entities: [Post, User],
    logging: false,
    synchronize: true,
    extra: {
        ssl: {
            rejectUnauthorized: false,
        },
    },
});
app.get("/", (req, res) => {
    res.send("Hello World!");
});
// app.use(isAuth);
connectDB
    .initialize()
    .then(() => {
    console.log(`Data Source has been initialized`);
    app.listen(port, () => {
        return console.log(`Express is listening at http://localhost:${port}`);
    });
})
    .catch((err) => {
    console.error(`Data Source initialization error`, err);
});
//# sourceMappingURL=app.js.map