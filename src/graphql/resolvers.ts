import { IndexPuppeteer } from "..";
import { Invoker } from "../commands/search.command";
import { MongoConexion } from "../db/mongo";
import { ResponseSearch } from "../interfaces/Responses";

export const resolvers = {
  Query: {
    initialResults: async () => {
      const index = new IndexPuppeteer(new Invoker(), new MongoConexion());
      const response: ResponseSearch = await index.getInitialResults();
      return response;
    },
    async searchProductByCategory(root: any, args: any) {
      const { categoryName } = args;

      const index = new IndexPuppeteer(new Invoker(), new MongoConexion());
      const response = await index.getProductByCategory(categoryName);

      return response;
    },
    categoriesList: () => {
      const index = new IndexPuppeteer(new Invoker(), new MongoConexion());
      const response = index.getCategories();
      return response;
    },
    async searchByProduct(root: any, arg: any) {
      const { name } = arg;
      if (!name) {
        return new Array<ResponseSearch>();
      }
      const index = new IndexPuppeteer(new Invoker(), new MongoConexion());
      const response = await index.searchByName(name);
      return response;
    },
  },
};
