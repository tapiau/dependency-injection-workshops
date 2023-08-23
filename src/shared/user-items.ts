export interface UserItemsDB {
    item_id: string,
    item_name: string,
    random_word: string,
    user_id: string,
    user_name: string,
}

export class UserItems {
    private constructor(
        public itemId: string,
        public itemName: string,
        public randomWord: string,
        public userId: string,
        public userName: string,
    ) {
    }

    static fromDatabase(userItemsDB: UserItemsDB): UserItems {
        return new UserItems(
            userItemsDB.item_id,
            userItemsDB.item_name,
            userItemsDB.random_word,
            userItemsDB.user_id,
            userItemsDB.user_name,
        );
    }
}
