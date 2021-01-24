import { ItemProduct, Seller } from "./ItemProduct";
import { IProducts } from "./Products";
import { UserProfile } from "../interfaces/User.interface";
import { ResponseLogin } from "../commands/login.command";
export interface ICommand {
  getImages(arr: Array<ItemProduct>): Promise<Array<ItemProduct>>;
  scrapInventories(...newStore: Array<IProducts>): Promise<Array<ItemProduct>>;
  calculateSponsors(arr: Array<ItemProduct>): Array<Seller>;
  filterByName(
    db: Array<ItemProduct>,
    itemToSearch: string
  ): Array<ItemProduct>;
  getCategoryByName(name: string): string;
  deleteDuplicated(arr: Array<ItemProduct>): Array<ItemProduct>;
}

export interface ILoginCommands {
  createUser(user: UserProfile): void;
  doLogin(email: string, password: string): Promise<ResponseLogin>;
}

export interface IUserCommmands {
  getAllFavorites(email: string): Promise<ItemProduct> | void;
  addFavorite(id: string, email: string): void;
  removeFavorite(id: string, email: string): void;
}
