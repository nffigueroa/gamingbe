import { PuppeteerService } from "./common/puppeteer";
import { ItemProduct, Seller } from "./interfaces/ItemProduct";

import * as admin from "firebase-admin";
import { ResponseSearch } from "./interfaces/Responses";
import { ICommand } from "./interfaces/Command";
import { CATEGORIES } from "./common/const";
var serviceAccount = require("./heyapp-93526-firebase-adminsdk-8k2b8-c30462ed1a.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://heyapp-93526.firebaseio.com/",
});

const dbFB = admin.database();

export class IndexPuppeteer {
  constructor(private commands: ICommand) {}

  async getInitialResults(): Promise<ResponseSearch> {
    const pup = new PuppeteerService();
    let filtered: ItemProduct[] = [];
    const r = await dbFB.ref("totalProducts").once("value");
    let dbFromFB: Array<any> = r.val();
    const maxRandom = Array(5).fill(1);
    maxRandom.forEach(() => {
      const positionRandom = Math.round(
        Math.random() * (dbFromFB.length - 1) + 1
      );
      console.log(positionRandom);
      filtered.push(dbFromFB[positionRandom]);
    });
    filtered = await this.commands.getImages(filtered);

    const response: ResponseSearch = {
      response: filtered,
      sponsors: this.commands.calculateSponsors(filtered),
      status: !filtered.length ? 404 : 200,
    };
    return response;
  }

  async calculate(itemToSearch: string): Promise<ResponseSearch> {
    let filtered = [];
    const r = await dbFB.ref("totalProducts").once("value");
    //let dbFromFB: Array<any> = []; // Remove for fetching all the db []
    let dbFromFB: Array<any> = r.val(); // Remove for fetching all the db []

    if (!dbFromFB || !dbFromFB.length) {
      dbFromFB = await this.commands.scrapInventories();
      dbFB.ref("totalProducts").set(dbFromFB);
    }
    dbFromFB = await this.commands.getImages(dbFromFB);
    dbFB.ref("totalProducts").update(dbFromFB);
    filtered = this.commands.filterByName(dbFromFB, itemToSearch);
    /*filtered = dbFromFB.map((item: ItemProduct) => ({
      ...item,
      category:
        Number(item.value) > 0 && item.name
          ? this.commands.getCategoryByName(item.name)
          : "",
    }));*/
    //dbFB.ref("totalProducts").update(filtered);
    const response: ResponseSearch = {
      response: filtered,
      sponsors: this.commands.calculateSponsors(filtered),
      status: !filtered.length ? 404 : 200,
    };
    return response;
  }

  getCategories() {
    return {
      data: {
        categories: CATEGORIES.map((item: any) => item.categoryName),
      },
      status: !CATEGORIES.length ? 404 : 200,
    };
  }

  async getProductByCategory(category: string) {
    const r = await dbFB.ref("totalProducts").once("value");
    let dbFromFB: Array<any> = r.val();

    const data = dbFromFB.filter(
      (item: ItemProduct) =>
        item.category?.toUpperCase() === category.toUpperCase()
    );
    const sponsors = this.commands.calculateSponsors(data);
    return {
      data,
      sponsors,
      status: !data.length ? 404 : 200,
    };
  }
}
