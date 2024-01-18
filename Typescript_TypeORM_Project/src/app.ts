import express from "express";
import { DataSource } from "typeorm";
import { json } from "body-parser";
import { router as authRouter } from "./routes/auth";
import { router as feedRouter } from "./routes/feed";

const app = express();

const port = 3000;

const connectDB = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASS,
  database: process.env.DB_DATABASE,
  port: parseInt(process.env.DB_PORT || "5432"),
  entities: ["src/entities/Post.ts", "src/entities/User.ts"],
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

app.use(json());

app.use("/auth", authRouter);

app.use("/feed", feedRouter);

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
