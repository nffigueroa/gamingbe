export interface ItemProduct {
  name: string;
  value: string;
  seller: Seller;
  category?: string;
  image?: string;
  url?: string;
  _id: string;
}

export interface Seller {
  key: string;
  name: string;
}
