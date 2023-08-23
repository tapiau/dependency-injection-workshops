import {createContainer, asClass, asValue} from "awilix";
import {UserRepository} from "./user.repository";
import {ItemRepository} from "./item.repository";
import knex, {Knex} from "knex";
import {UserItemsRepository} from "./user-items.repository";

export interface Dependencies {
    database: Knex;
    itemRepository: ItemRepository;
    userRepository: UserRepository;
    userItemsRepository: UserItemsRepository;
}

const container = createContainer<Dependencies>().register({
    database: asValue(knex({
        client: "pg",
        connection: {
            user: process.env.DATABASE_USER,
            password: process.env.DATABASE_PASSWORD,
            database: process.env.DATABASE_NAME,
            host: process.env.DATABASE_HOST,
            port: Number(process.env.DATABASE_PORT),
        },
        acquireConnectionTimeout: 30000,
    })),
    itemRepository: asClass(ItemRepository),
    userRepository: asClass(UserRepository),
    userItemsRepository: asClass(UserItemsRepository),
})

export {container};
