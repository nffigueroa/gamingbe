import { MongoConexion } from "../db/mongo";
import { userShchema } from "../db/schemas/user";
import { IUserCommmands } from "../interfaces/Command";
import { ItemProduct } from "../interfaces/ItemProduct";
import { IMongoDB } from "../interfaces/Mongo";
import { Inventory } from "./Inventory";
import { Invoker } from "../commands/search.command";
import { UserProfile } from "../interfaces/User.interface";
import { inventorySchema } from "../db/schemas/Inventory";

export class User implements IUserCommmands {
  constructor(private commands: IUserCommmands, private mongoDb: IMongoDB) {}
  async getAllFavorites(email: string): Promise<any> {
    try {
      const searchCommands = new Invoker();
      await this.mongoDb.connect();
      const user = await userShchema.find({ email });
      const list = await inventorySchema
        .find()
        .where("_id")
        .in(user[0].products)
        .exec();
      return {
        status: 200,
        response: list,
        sponsors: searchCommands.calculateSponsors(list),
      };
    } catch (error) {
      console.log(error);
      return {
        status: 500,
      };
    }
  }

  async addFavorite(id: string, email: string): Promise<any> {
    try {
      await this.mongoDb.connect();
      const user: UserProfile = await userShchema.findOne({
        email: email,
      });
      await userShchema.findOneAndUpdate(
        { email },
        { products: [...(user.products ?? ""), id] }
      );
      const userSelected: UserProfile = await userShchema.findOne({ email });
      userSelected.password = "*********";
      return {
        status: 200,
        user: userSelected,
      };
    } catch (error) {
      console.log(error);
      return {
        status: 500,
      };
    }
  }

  async removeFavorite(id: string, email: string): Promise<any> {
    try {
      await this.mongoDb.connect();
      const user = await userShchema.findOne({ email });
      const newList = user.products.filter(
        (idProducts: string) => idProducts !== id
      );
      await userShchema.findOneAndUpdate({ email }, { products: newList });
      const userSelected: UserProfile = await userShchema.findOne({ email });
      userSelected.password = "*********";
      return {
        status: 200,
        user: userSelected,
      };
    } catch (error) {
      console.log(error);
      return {
        status: 500,
      };
    }
  }
}
