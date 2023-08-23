export interface ItemDB {
    item_id: string,
    user_id: string,
    item_name: string,
    random_word: string,
    created_at?: string,
}

export class Item {
    private constructor(
        public itemId: string,
        public userId: string,
        public itemName: string,
        public randomWord: string,
        public createdAt?: string,
    ) {
    }

    static fromDatabase(itemDB: ItemDB): Item {
        return new Item(
            itemDB.item_id,
            itemDB.user_id,
            itemDB.item_name,
            itemDB.random_word,
            itemDB.created_at ?? "",
        );
    }
}
