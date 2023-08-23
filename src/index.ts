import express, {NextFunction, Request, Response} from "express";
import http from "http";
import {appConfig} from "./shared/config";
import {v4} from "uuid";
import {StatusCodes} from "http-status-codes";
import axios from "axios";
import {container} from "./shared/dependencies";

const app = express();

app.use(function (req, res, next) {
    console.log(`App received http request: ${req.method} ${req.url} | ${JSON.stringify(req.params)}`);
    next();
});

app.get("/items/add/:itemName/:userId", async (req, res) => {
    const itemId = v4();
    const randomWordAxiosResponse = await axios({
        url: "https://random-word-api.herokuapp.com/word",
    });

    await container.cradle.itemRepository.insert({
        itemId: itemId,
        userId: req.params.userId,
        itemName: req.params.itemName,
        randomWord: randomWordAxiosResponse.data[0],
    });

    res.status(StatusCodes.OK).json({itemId});
});

app.get("/items/remove/:itemId", async (req: Request, res: Response) => {
    await container.cradle.itemRepository.deleteById(req.params.itemId);
    res.sendStatus(StatusCodes.OK);
});

app.get("/items/list", async (req: Request, res: Response) => {
    const items = await container.cradle.itemRepository.listAll();
    res.status(StatusCodes.OK).json({
        items: items,
    });
});

app.get("/users/add/:userName", async (req: Request, res: Response) => {
    const userId = v4();
    const randomWordAxiosResponse = await axios({
        url: "https://random-word-api.herokuapp.com/word",
    });
    await container.cradle.userRepository.insert({
        userId,
        userName: req.params.userName,
        randomWord: randomWordAxiosResponse.data[0],
    });
    res.status(StatusCodes.OK).json({userId});
});

app.get("/users/list", async (req: Request, res: Response) => {
    const users = await container.cradle.userRepository.listAll();
    res.status(StatusCodes.OK).json({users});
});

app.get("/user-items/list/:userId", async (req: Request, res: Response) => {
    const userItemsList = await container.cradle.userItemsRepository.listAll(req.params.userId);
    res.status(StatusCodes.OK).json({
        userItems: userItemsList,
    });
});

app.use(function (req: Request, res: Response, next: NextFunction) {
    console.log(`App responded on http request: <${res.statusCode}> ${req.method} ${req.url}`);
    next();
});

app.use([
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (err, req: Request, res: Response, next: NextFunction): void => {
        console.warn(err);
        res.status(err.statusCode).send(JSON.stringify(err));
    },
]);

http
    .createServer(app)
    .listen({port: appConfig.PORT}, () => console.log(`Server is listening on port: ${appConfig.PORT}`))
;
