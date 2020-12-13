import { ItemProduct, Seller } from "./ItemProduct";

export interface ResponseSearch {
  response: Array<ItemProduct>;
  sponsors: Array<Seller>;
  status: number;
}
