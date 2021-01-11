import { makeExecutableSchema } from "graphql-tools";
import { resolvers } from "./resolvers";
import { gql } from "apollo-server-micro";

const typeDefs = gql`
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

export default makeExecutableSchema({
  typeDefs,
  resolvers,
});
