import { Inventory } from "../classes/Inventory";
import { Invoker } from "../commands/search.command";
import { MongoConexion } from "../db/mongo";
import { ResponseSearch } from "../interfaces/Responses";

export const resolversSearch = {
  Query: {
    initialResults: async () => {
      const index = new Inventory(new Invoker(), new MongoConexion());
      const response: ResponseSearch = await index.getInitialResults();
      return response;
    },
    async searchProductByCategory(root: any, args: any) {
      const { categoryName } = args;

      const index = new Inventory(new Invoker(), new MongoConexion());
      const response = await index.getProductByCategory(categoryName);

      return response;
    },
    categoriesList: () => {
      const index = new Inventory(new Invoker(), new MongoConexion());
      const response = index.getCategories();
      return response;
    },
    async searchByProduct(root: any, arg: any) {
      const { name } = arg;
      if (!name) {
        return new Array<ResponseSearch>();
      }
      const index = new Inventory(new Invoker(), new MongoConexion());
      const response = await index.searchByName(name);
      return response;
    },
  },
};

export const typeDefsSearch = `
  type Seller {
    key: String
    name: String
  }
  type ItemProduct {
    name: String
    value: String
    seller: Seller
    category: String
    image: String
    url: String
    _id: String
  }
  type ResponseSearch {
    response: [ItemProduct]
    sponsors: [Seller]
    status: Int
  }
  type Query {
    initialResults: ResponseSearch
    searchProductByCategory(categoryName: String!): ResponseSearch
    categoriesList: [String]
    searchByProduct(name: String!): ResponseSearch
  }
`;
