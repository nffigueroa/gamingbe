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
    //filtered = await this.commands.getImages(filtered);

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
    /*await inventorySchema.collection
      .find({})
      .toArray();*/
    //inventorySchema.collection.insertMany(dbFromFB);
    //dbFromFB = this.commands.deleteDuplicated(dbFromFB);
    //await inventorySchema.collection.deleteMany({});
    if (!dbFromFB || !dbFromFB.length) {
      dbFromFB = await this.commands.scrapInventories(
        new TiendaGamerMedellin(),
        new SpeedLogic(),
        new Tauret(),
        new ImagenWorld(),
        new GamerColombia(),
        new ClonesYPerifericos()
      );

      dbFromFB = dbFromFB.filter(
        (item: ItemProduct) =>
          !!item.name && !!item.value && !isNaN(Number(item.value))
      );
      //inventorySchema.collection.insertMany(dbFromFB);
    }
    //dbFromFB = await this.commands.getImages(dbFromFB);
    filtered = this.commands.filterByName(dbFromFB, itemToSearch);

    /* filtered = dbFromFB.map((item: ItemProduct) => ({
      ...item,
      category:
        Number(item.value) > 0 && item.name
          ? this.commands.getCategoryByName(item.name)
          : "",
    }));*/
    const response: ResponseSearch = {
      response: filtered,
      sponsors: this.commands.calculateSponsors(filtered),
      status: !filtered.length ? 404 : 200,
    };
    return response;
  }

  getCategories(): Array<String> {
    return CATEGORIES.map((item: any) => item.categoryName);
  }

  async bulkNewDataAndUpdate(): Promise<any> {
    await this.mongoDb.connect();
    const stores = [
      new TiendaGamerMedellin(),
      new SpeedLogic(),
      new Tauret(),
      new ImagenWorld(),
      new GamerColombia(),
      new ClonesYPerifericos(),
    ];
    try {
      let dbFromFB = Array<ItemProduct>();
      let index = 0;
      let errors = 0;
      const getInventories = async () => {
        if (index >= stores.length) {
          errors = 0;
          return;
        }
        try {
          console.log("Attemtping ", index);

          dbFromFB = await this.commands.scrapInventories(stores[index]);
          dbFromFB = dbFromFB.filter(
            (item: ItemProduct) =>
              !!item.name && !!item.value && !isNaN(Number(item.value))
          );
          await inventorySchema.bulkWrite(
            dbFromFB.map((product: ItemProduct) => ({
              updateOne: {
                filter: {
                  name: product.name,
                },
                update: {
                  $set: product,
                },
                upsert: true,
              },
            }))
          );
          console.log(index, " Updated");
          index++;
          await getInventories();
        } catch (error) {
          errors++;
          console.log(error);
          await getInventories();
        }
      };
      await getInventories();
    } catch (error) {
      console.log(error);
    }
    return { response: "All up to date" };
  }

  async getProductByCategory(category: string): Promise<ResponseSearch> {
    await this.mongoDb.connect();
    let dbFromFB: Array<ItemProduct> = await inventorySchema.collection
      .find({})
      .toArray();
    dbFromFB = dbFromFB.filter(
      (item: ItemProduct) => !!item.name && !!item.value
    );
    const response: Array<ItemProduct> = dbFromFB.filter(
      (item: ItemProduct) =>
        item.category?.toUpperCase() === category.toUpperCase()
    );

    const sponsors = this.commands.calculateSponsors(response);
    return {
      response,
      sponsors,
      status: !response.length ? 404 : 200,
    };
  }
}
