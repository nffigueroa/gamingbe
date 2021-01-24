import { gql } from "apollo-server-micro";
import { Login } from "../classes/Login";
import {
  LoginCommands,
  ResponseCreateUser,
  ResponseLogin,
} from "../commands/login.command";
import { MongoConexion } from "../db/mongo";
import { UserProfile } from "../interfaces/User.interface";

export const resolversLogin = {
  Mutation: {
    createUser: async (_: any, args: any) => {
      const { user }: { user: UserProfile } = args;

      const logjn = new Login(new LoginCommands(new MongoConexion()));
      const response: ResponseCreateUser = await logjn.createUser(user);
      return response;
    },
  },
  Query: {
    login: async (_: any, args: any) => {
      const {
        credentials: { email, password },
      } = args;
      console.log(email, password);

      const logjn = new Login(new LoginCommands(new MongoConexion()));
      const response: ResponseLogin = await logjn.doLogin(email, password);
      return response;
    },
  },
};

export const typeDefsLogin = `
  input User {
      _id: String
    firstName: String
    lastName: String
    email: String
    password: String
    sendNotifications: Boolean
  }
  type UserBody {
    _id: String
    firstName: String
    lastName: String
    email: String
    password: String
    sendNotifications: Boolean
  }
  input loginCredentials{
      email: String!
      password: String!
  }
  type ResponseCreateUser {
    msg: String
    status: Int
  }
  type ResponseLogin {
    user: UserBody!
    status: Int!
  }
  type Mutation {
    createUser(user: User!): ResponseCreateUser
  }
  extend type Query {
    login(credentials: loginCredentials!): ResponseLogin!
  }
 
`;
