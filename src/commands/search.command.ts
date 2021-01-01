import { ClonesYPerifericos } from "../classes/ClonesYPerifericos";
import { GamerColombia } from "../classes/GamersColombia";
import { ImagenWorld } from "../classes/ImagenWorld";
import { SpeedLogic } from "../classes/SpeedLogic";
import { Tauret } from "../classes/Tauret";
import { ICommand } from "../interfaces/Command";
import { ItemProduct, Seller } from "../interfaces/ItemProduct";
import { PuppeteerService } from "../common/puppeteer";
import { CATEGORIES } from "../common/const";
import { IProducts } from "../interfaces/Products";

export class Invoker implements ICommand {
  async getImages(arr: Array<ItemProduct>): Promise<Array<ItemProduct>> {
    const pup = new PuppeteerService();
    for (let i = 0; i < arr.length; i++) {
      if (!arr[i].name || arr[i].image) {
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
    console.log(stores);
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
    console.log(r);
    return CATEGORIES.filter(
      ({ keys }) =>
        !!keys.filter((key: string) =>
          name.trim().toUpperCase().includes(key.toUpperCase())
        ).length
    )[0].categoryName;
  }
}
