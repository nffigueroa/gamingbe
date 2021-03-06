import { ICommand } from "../interfaces/Command";
import { ItemProduct, Seller } from "../interfaces/ItemProduct";
import { PuppeteerService } from "../common/puppeteer";
import { CATEGORIES } from "../common/categories";
import { IProducts } from "../interfaces/Products";

export class Invoker implements ICommand {
  async getImages(arr: Array<ItemProduct>): Promise<Array<ItemProduct>> {
    const pup = new PuppeteerService();
    for (let i = 0; i < arr.length; i++) {
      if (
        !arr[i].name ||
        arr[i].image ||
        (arr[i].image && !arr[i].image?.includes("////"))
      ) {
        console.log("Ejecucion " + i + " de " + arr.length, !!arr[i].image);
        continue;
      }
      arr[i].image = arr[i].image || (await pup.getImage(arr[i].name));
      console.log("Ejecucion " + i + " de " + arr[i].name, !!arr[i].image);
    }
    return arr;
  }

  async scrapInventories(
    ...storesToScrap: Array<IProducts>
  ): Promise<Array<ItemProduct>> {
    let stores = await Promise.all(
      storesToScrap.map((store: IProducts) => store.getTable())
    );
    stores = [].concat.apply([], stores);
    return stores;
  }

  calculateSponsors(arr: Array<ItemProduct>): Array<Seller> {
    const result: Array<Seller> = arr.map((item: ItemProduct) => item.seller);
    const seen = new Set();
    return result.filter((item: Seller) => {
      const duplicate = seen.has(item.key);
      seen.add(item.key);
      return !duplicate;
    });
  }

  filterByName(
    db: Array<ItemProduct>,
    itemToSearch: string
  ): Array<ItemProduct> {
    return db.filter(
      (item: ItemProduct) =>
        item.name &&
        item.name.toUpperCase().includes(itemToSearch.toUpperCase())
    );
  }

  getCategoryByName(name: string): string {
    console.log(name + "111");
    const r = CATEGORIES.filter(
      ({ keys }) =>
        !!keys.filter((key: string) =>
          name.trim().toUpperCase().includes(key.toUpperCase())
        ).length
    )[0].categoryName;
    return CATEGORIES.filter(
      ({ keys }) =>
        !!keys.filter((key: string) =>
          name.trim().toUpperCase().includes(key.toUpperCase())
        ).length
    )[0].categoryName;
  }

  deleteDuplicated(items: Array<ItemProduct>) {
    const seen = new Set();
    console.log(items.length, "Inicial");
    items = items.filter((item: ItemProduct) => {
      const duplicate = seen.has(item.name);
      seen.add(item.name);
      return !duplicate;
    });
    console.log(items.length, "Final");
    return items;
  }
}
