import knex from "knex";

export const database = knex({
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
