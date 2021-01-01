import { PuppeteerService } from "./common/puppeteer";
import { ItemProduct, Seller } from "./interfaces/ItemProduct";

import * as admin from "firebase-admin";
import { ResponseSearch } from "./interfaces/Responses";
import { IMongoDB } from "./interfaces/Mongo";
import { ICommand } from "./interfaces/Command";
import { CATEGORIES } from "./common/const";
import { TiendaGamerMedellin } from "./classes/TiendaGamerMedellin";
import { SpeedLogic } from "./classes/SpeedLogic";
import { Tauret } from "./classes/Tauret";
import { ImagenWorld } from "./classes/ImagenWorld";
import { GamerColombia } from "./classes/GamersColombia";
import { ClonesYPerifericos } from "./classes/ClonesYPerifericos";
import { inventorySchema } from "./db/schemas/Inventory";

export class IndexPuppeteer {
  constructor(private commands: ICommand, private mongoDb: IMongoDB) {}

  async getInitialResults(): Promise<ResponseSearch> {
    await this.mongoDb.connect();
    let filtered: ItemProduct[] = [];
    let dbFromFB: Array<any> = await inventorySchema.collection
      .find({})
      .toArray();
    dbFromFB = dbFromFB.filter(
      (item: ItemProduct) => !!item.name && !!item.value
    );
    const maxRandom = Array(20).fill(1);
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
    await this.mongoDb.connect();
    let filtered = [];
    //const r = await dbFB.ref("totalProducts").once("value");
    //let dbFromFB: Array<any> = []; // Remove for fetching all the db []
    let dbFromFB: Array<any> = await inventorySchema.collection
      .find({})
      .toArray(); // Remove for fetching all the db []
    //inventorySchema.collection.insertMany(dbFromFB);

    if (!dbFromFB || !dbFromFB.length) {
      dbFromFB = await this.commands.scrapInventories(
        new TiendaGamerMedellin(),
        new SpeedLogic(),
        new Tauret(),
        new ImagenWorld(),
        new GamerColombia(),
        new ClonesYPerifericos()
      );
      await inventorySchema.collection.deleteMany({});
      inventorySchema.collection.insertMany(dbFromFB);
    }
    dbFromFB = dbFromFB.filter(
      (item: ItemProduct) => !!item.name && !!item.value
    );
    //dbFromFB = await this.commands.getImages(dbFromFB);
    //dbFB.ref("totalProducts").update(dbFromFB);
    filtered = this.commands.filterByName(dbFromFB, itemToSearch);
    inventorySchema.bulkWrite(
      filtered.map((product: ItemProduct) => ({
        updateOne: {
          filter: {
            _id: product._id,
          },
          update: {
            $set: product,
          },
          upsert: true,
        },
      }))
    );
    /* filtered = dbFromFB.map((item: ItemProduct) => ({
      ...item,
      category:
        Number(item.value) > 0 && item.name
          ? this.commands.getCategoryByName(item.name)
          : "",
    }));*/
    const response: ResponseSearch = {
      response: filtered,
      sponsors: this.commands.calculateSponsors(dbFromFB),
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
    await this.mongoDb.connect();
    let dbFromFB: Array<any> = await inventorySchema.collection
      .find({})
      .toArray();
    dbFromFB = dbFromFB.filter(
      (item: ItemProduct) => !!item.name && !!item.value
    );
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
