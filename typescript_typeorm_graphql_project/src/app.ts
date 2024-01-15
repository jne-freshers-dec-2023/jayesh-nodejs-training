import express from "express";
import { DataSource } from "typeorm";
import { json } from "body-parser";
import { graphqlSchema } from "./graphql/schema";
import graphqlResolver from "./graphql/resolver";
import { graphqlHTTP } from "express-graphql";
import { configDotenv } from "dotenv";
import { isAuth } from "./middleware/is-auth";
configDotenv();
const app = express();

const ServerPort = 3000;

const connectDB = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASS || "postgres",
  database: process.env.DB_DATABASE,
  port: parseInt(process.env.DB_PORT || "5432"),
  entities: ["src/entities/Post.ts", "src/entities/User.ts"],
  logging: false,
  synchronize: false,
  extra: {
    ssl: {
      rejectUnauthorized: false,
    },
  },
});

app.use(json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use(isAuth);

app.use(
  "/graphql",
  graphqlHTTP({
    schema: graphqlSchema,
    rootValue: graphqlResolver,
    graphiql: true,
    customFormatErrorFn(err: any) {
      if (!err.originalError) {
        return err;
      }
      const data = err.originalError.data;
      const message = err.message || "An error occurred.";
      const code = err.originalError.code || 500;
      return { message: message, status: code, data: data };
    },
  })
);

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;

  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

connectDB
  .initialize()
  .then(async () => {
    console.log(`Data Source has been initialized`);
    app.listen(ServerPort, () => {
      return console.log(
        `Express is listening at http://localhost:${ServerPort}`
      );
    });
  })
  .catch((err) => {
    console.error(`Data Source initialization error`, err);
  });
