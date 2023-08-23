import express from "express";
import http from "http";
import { appConfig } from "./shared/config";
import { v4 } from "uuid";
import { StatusCodes } from "http-status-codes";
import { UserRepository } from "./shared/users.repository";
import knex from "knex";
import axios from "axios";

const app = express();
const userRepository = new UserRepository();

const database = knex({
  client: "pg",
  connection: {
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    host: process.env.DATABASE_HOST,
    port: Number(process.env.DATABASE_PORT),
  },
  acquireConnectionTimeout: 30000,
});

app.use(function (req, res, next) {
  console.log(`App received http request: ${req.method} ${req.url} | ${JSON.stringify(req.params)}`);
  next();
});

app.get("/items/add/:itemName/:userId", async (req, res) => {
  const itemId = v4();
  const randomWordAxiosResponse = await axios({
    url: "https://random-word-api.herokuapp.com/word",
  });
  await database.table("app.items").insert({
    item_id: itemId,
    user_id: req.params.userId,
    item_name: req.params.itemName,
    random_word: randomWordAxiosResponse.data[0],
  });
  res.status(StatusCodes.OK).json({ itemId });
});

app.get("/items/remove/:itemId", async (req, res) => {
  await database
    .table("app.items")
    .where({
      item_id: req.params.itemId,
    })
    .delete();
  res.sendStatus(StatusCodes.OK);
});

app.get("/items/list", async (req, res) => {
  const items = await database.table("app.items").select();
  res.status(StatusCodes.OK).json({
    items: items.map((item) => ({
      itemId: item.item_id,
      userId: item.user_id,
      createdAt: item.created_at,
      itemName: item.item_name,
      randomWord: item.random_word,
    })),
  });
});

app.get("/users/add/:userName", async (req, res) => {
  const userId = v4();
  const randomWordAxiosResponse = await axios({
    url: "https://random-word-api.herokuapp.com/word",
  });
  await userRepository.insertOne({
    userId,
    userName: req.params.userName,
    randomWord: randomWordAxiosResponse.data[0],
  });
  res.status(StatusCodes.OK).json({ userId });
});

app.get("/users/list", async (req, res) => {
  const users = await userRepository.listAll();
  res.status(StatusCodes.OK).json({ users });
});

app.get("/user-items/list/:userId", async (req, res) => {
  const userItems = await database
    .select("*")
    .from("app.users")
    .leftJoin("app.items", "users.user_id", "items.user_id")
    .where({
      "users.user_id": req.params.userId,
    });
  res.status(StatusCodes.OK).json({
    userItems: userItems.map((userItem) => ({
      itemId: userItem.item_id,
      itemName: userItem.item_name,
      randomWord: userItem.random_word,
      userId: userItem.user_id,
      userName: userItem.user_name,
    })),
  });
});

app.use(function (req, res, next) {
  console.log(`App responded on http request: <${res.statusCode}> ${req.method} ${req.url}`);
  next();
});

app.use([
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  (err, req, res, next): void => {
    console.warn(err);
    res.status(err.statusCode).send(JSON.stringify(err));
  },
]);

http
  .createServer(app)
  .listen({ port: appConfig.PORT }, () => console.log(`Server is listening on port: ${appConfig.PORT}`));
