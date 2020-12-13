import { ItemProduct, Seller } from "./ItemProduct";

export interface ICommand {
  getImages(arr: Array<ItemProduct>): Promise<Array<ItemProduct>>;
  scrapInventories(): Promise<Array<ItemProduct>>;
  calculateSponsors(arr: Array<ItemProduct>): Array<Seller>;
  filterByName(
    db: Array<ItemProduct>,
    itemToSearch: string
  ): Array<ItemProduct>;
}
