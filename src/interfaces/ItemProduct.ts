export interface ItemProduct {
  name: string;
  value: string;
  seller: Seller;
  category?: string;
  image?: string;
  urlRefer?: string;
}

export interface Seller {
  key: string;
  name: string;
}
