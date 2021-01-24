import { IUserCommmands } from "../interfaces/Command";
import { ItemProduct } from "../interfaces/ItemProduct";

export class UserCommands implements IUserCommmands {
  getAllFavorites(): Promise<ItemProduct> | void {}
  addFavorite(id: string): void {}
  removeFavorite(id: string): void {}
}
