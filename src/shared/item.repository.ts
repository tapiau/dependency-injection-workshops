import {Dependencies} from "./dependencies";
import {Item, ItemDB} from "./item";

export class ItemRepository {

  public constructor(
      private dependencies: Dependencies
  ) {
  }

  public async insert(item: Item) {
    await this.dependencies.database.table("app.items").insert({
      item_id: item.itemId,
      user_id: item.userId,
      item_name: item.itemName,
      random_word: item.randomWord,
    });
  }

  public async deleteById(itemId: string) {
    await this.dependencies.database
      .table("app.items")
      .where({
        item_id: itemId,
      })
      .delete();
  }

  public async listAll(): Promise<Item[]> {
    const itemList = await this.dependencies.database.table("app.items").select();
    return itemList.map((item: ItemDB) => Item.fromDatabase(item));
  }
}
