import { ItemProduct, Seller } from "../interfaces/ItemProduct";

import { ResponseSearch } from "../interfaces/Responses";
import { IMongoDB } from "../interfaces/Mongo";
import { ICommand } from "../interfaces/Command";
import { CATEGORIES } from "../common/categories";
import { TiendaGamerMedellin } from "./TiendaGamerMedellin";
import { SpeedLogic } from "./SpeedLogic";
import { Tauret } from "./Tauret";
import { ImagenWorld } from "./ImagenWorld";
import { GamerColombia } from "./GamersColombia";
import { ClonesYPerifericos } from "./ClonesYPerifericos";
import { inventorySchema } from "../db/schemas/Inventory";

export class Inventory {
  constructor(private commands: ICommand, private mongoDb: IMongoDB) {}

  async getInitialResults(): Promise<ResponseSearch> {
    try {
      await this.mongoDb.connect();
      let dbFromFB: Array<any> = await inventorySchema.aggregate([
        { $sample: { size: 10 } },
      ]);
      dbFromFB = dbFromFB.filter(
        (item: ItemProduct) => !!item.name && !!item.value
      );
      const response: ResponseSearch = {
        response: dbFromFB,
        sponsors: this.commands.calculateSponsors(dbFromFB),
        status: !dbFromFB.length ? 404 : 200,
      };
      return response;
    } catch (error) {
      console.log(error);

      return {
        response: [],
        sponsors: [],
        status: 500,
      };
    }
  }

  async searchByName(itemToSearch: string): Promise<ResponseSearch> {
    try {
      await this.mongoDb.connect();
      let dbFromFB: Array<any> = await inventorySchema.find({
        name: {
          $regex: itemToSearch,
          $options: "i",
        },
      });
      const response: ResponseSearch = {
        response: dbFromFB,
        sponsors: this.commands.calculateSponsors(dbFromFB),
        status: !dbFromFB.length ? 404 : 200,
      };
      return response;
    } catch (error) {
      console.log(error);

      return {
        response: [],
        sponsors: [],
        status: 500,
      };
    }
  }

  getCategories(): Array<String> {
    return CATEGORIES.map((item: any) => item.categoryName);
  }

  async setImages() {
    await this.mongoDb.connect();
    let dbFromFB: Array<any> = await inventorySchema.collection
      .find({})
      .toArray();
    dbFromFB = await this.commands.getImages(dbFromFB);
    await inventorySchema.bulkWrite(
      dbFromFB.map((product: ItemProduct) => ({
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
    return { response: "All Images configured" };
  }

  async categorize() {
    await this.mongoDb.connect();
    let dbFromFB: Array<any> = await inventorySchema.collection
      .find({})
      .toArray();
    dbFromFB = dbFromFB.map((item: ItemProduct) => ({
      ...item,
      category:
        Number(item.value) > 0 && item.name
          ? this.commands.getCategoryByName(item.name)
          : "",
    }));
    await inventorySchema.bulkWrite(
      dbFromFB.map((product: ItemProduct) => ({
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
    return { response: "All categories configured" };
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
        if (errors > 3) {
          errors = 0;
          await getInventories();
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
      .find({
        category: {
          $regex: category,
          $options: "i",
        },
      })
      .toArray();
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

  async getProductById(id: string): Promise<ItemProduct> {
    await this.mongoDb.connect();
    return await inventorySchema.findById(id);
  }
}
