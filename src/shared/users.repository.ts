import type {Knex} from "knex";
import knex from "knex";

export class UserRepository {
    private database: Knex;

    public constructor() {
        this.database = knex({
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
    }

    public async insertOne(payload: { userId: string; userName: string; randomWord: string }) {
        await this.database.table("app.users").insert({
            user_id: payload.userId,
            user_name: payload.userName,
            random_word: payload.randomWord,
        });
    }

    public async deleteOne(payload: { userId: string }) {
        await this.database
            .table("app.users")
            .where({
                user_id: payload.userId,
            })
            .delete();
    }

    public async listAll() {
        const users = await this.database.table("app.users").select();
        return users.map((user) => ({
            userId: user.user_id,
            userName: user.user_name,
            randomWord: user.random_word,
        }));
    }
}
