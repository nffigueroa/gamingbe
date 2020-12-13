export interface ItemProduct {
  name: string;
  value: string;
  seller: Seller;
  image?: string;
  urlRefer?: string;
}

export interface Seller {
  key: string;
  name: string;
}
