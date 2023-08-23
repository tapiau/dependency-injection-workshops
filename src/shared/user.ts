export interface UserDB {
    user_id: string,
    user_name: string,
    random_word: string,
}

export class User {
    private constructor(
        public userId: string,
        public userName: string,
        public randomWord: string,
        // public createdAt?: string,
    ) {
    }

    static fromDatabase(userDB: UserDB): User {
        return new User(
            userDB.user_id,
            userDB.user_name,
            userDB.random_word,
        );
    }
}
