import { ItemProduct, Seller } from "./ItemProduct";
import { IProducts } from "./Products";

export interface ICommand {
  getImages(arr: Array<ItemProduct>): Promise<Array<ItemProduct>>;
  scrapInventories(...newStore: Array<IProducts>): Promise<Array<ItemProduct>>;
  calculateSponsors(arr: Array<ItemProduct>): Array<Seller>;
  filterByName(
    db: Array<ItemProduct>,
    itemToSearch: string
  ): Array<ItemProduct>;
  getCategoryByName(name: string): string;
}
