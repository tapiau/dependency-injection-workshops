import axios from "axios";
import * as falso from "@ngneat/falso";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { database } from "./common";

beforeEach(async () => {
  await database.table("app.users").truncate();
  await database.table("app.items").truncate();
});
afterAll(async () => {
  await database.destroy();
});

it("user can be added to database", async () => {
  const addUserResult = await axios(`http://app:${process.env.PORT}/users/add/${falso.randSuperheroName()}`);

  expect(addUserResult.status).toStrictEqual(StatusCodes.OK);
  expect(addUserResult.data).toStrictEqual({
    userId: expect.any(String),
  });
});

it("user can be listed in database", async () => {
  const userName = falso.randUserName({ withAccents: false });
  const addUserResult = await axios(`http://app:${process.env.PORT}/users/add/${userName}`);
  const listUserResult = await axios(`http://app:${process.env.PORT}/users/list`);

  expect(listUserResult.status).toStrictEqual(StatusCodes.OK);
  expect(listUserResult.data).toStrictEqual({
    users: [
      {
        userId: addUserResult.data.userId,
        userName,
        randomWord: expect.any(String),
      },
    ],
  });
});

it("item can be added to user", async () => {
  const itemName = falso.randProductName();
  const addUserResult = await axios(`http://app:${process.env.PORT}/users/add/${falso.randSuperheroName()}`);
  const addItemResult = await axios(
    `http://app:${process.env.PORT}/items/add/${itemName}/${addUserResult.data.userId}`,
  );

  expect(addItemResult.status).toStrictEqual(StatusCodes.OK);
  expect(addItemResult.data).toStrictEqual({
    itemId: expect.any(String),
  });
});

it("item can be listed to user", async () => {
  const itemName = falso.randProductName();
  const addUserResult = await axios(`http://app:${process.env.PORT}/users/add/${falso.randSuperheroName()}`);
  const addItemResult = await axios(
    `http://app:${process.env.PORT}/items/add/${itemName}/${addUserResult.data.userId}`,
  );
  const listItemResult = await axios(`http://app:${process.env.PORT}/items/list`);

  expect(addItemResult.status).toStrictEqual(StatusCodes.OK);
  expect(listItemResult.data).toStrictEqual({
    items: [
      {
        itemId: addItemResult.data.itemId,
        userId: addUserResult.data.userId,
        createdAt: expect.any(String),
        itemName,
        randomWord: expect.any(String),
      },
    ],
  });
});

it("item can be removed", async () => {
  const itemName = falso.randProductName();
  const addUserResult = await axios(`http://app:${process.env.PORT}/users/add/${falso.randSuperheroName()}`);
  const addItemResult = await axios(
    `http://app:${process.env.PORT}/items/add/${itemName}/${addUserResult.data.userId}`,
  );
  const removeItemResult = await axios(`http://app:${process.env.PORT}/items/remove/${addItemResult.data.itemId}`);
  const listItemResult = await axios(`http://app:${process.env.PORT}/items/list`);

  expect(removeItemResult.status).toStrictEqual(StatusCodes.OK);
  expect(removeItemResult.data).toStrictEqual(ReasonPhrases.OK);
  expect(addItemResult.status).toStrictEqual(StatusCodes.OK);
  expect(listItemResult.data).toStrictEqual({
    items: [],
  });
});

it("user can list own items", async () => {
  const userName = falso.randSuperheroName();
  const itemName = falso.randProductName();
  const addUserResult = await axios(`http://app:${process.env.PORT}/users/add/${userName}`);
  const addItemResult = await axios(
    `http://app:${process.env.PORT}/items/add/${itemName}/${addUserResult.data.userId}`,
  );
  const userItemsListResult = await axios(
    `http://app:${process.env.PORT}/user-items/list/${addUserResult.data.userId}`,
  );

  expect(userItemsListResult.status).toStrictEqual(StatusCodes.OK);
  expect(userItemsListResult.data).toStrictEqual({
    userItems: [
      {
        userId: addUserResult.data.userId,
        randomWord: expect.any(String),
        userName,
        itemId: addItemResult.data.itemId,
        itemName,
      },
    ],
  });
});
