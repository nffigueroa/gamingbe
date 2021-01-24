import { makeExecutableSchema } from "graphql-tools";
import { resolversSearch, typeDefsSearch } from "./resolvers.search";

export default makeExecutableSchema({
  typeDefs: [typeDefsSearch],
  resolvers: {
    ...resolversSearch,
  },
});
