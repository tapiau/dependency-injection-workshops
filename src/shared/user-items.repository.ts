import {Dependencies} from "./dependencies";
import {UserItems, UserItemsDB} from "./user-items";

export class UserItemsRepository {

    public constructor(
        private dependencies: Dependencies
    ) {
    }

    public async listAll(userId: string) {
        const userItemsList = await this.dependencies.database
            .select([
                "items.created_at",
                "items.item_id",
                "items.item_name",
                "items.random_word",
                "users.user_id",
                "users.user_name",
            ])
            .from("app.users")
            .leftJoin("app.items", "users.user_id", "items.user_id")
            .where({
                "users.user_id": userId,
            });
        return userItemsList.map((userItem: UserItemsDB) => UserItems.fromDatabase(userItem));
    }
}
