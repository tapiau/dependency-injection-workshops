import {Dependencies} from "./dependencies";
import {User, UserDB} from "./user";

export class UserRepository {

    public constructor(
        private dependencies: Dependencies
    ) {
    }

    public async insert(user: User) {
        await this.dependencies.database.table("app.users").insert({
            user_id: user.userId,
            user_name: user.userName,
            random_word: user.randomWord,
        });
    }

    public async deleteById(userId: string) {
        await this.dependencies.database
            .table("app.users")
            .where({
                user_id: userId,
            })
            .delete();
    }

    public async listAll() {
        const users = await this.dependencies.database.table("app.users").select();
        return users.map((user: UserDB) => User.fromDatabase(user));
    }
}
