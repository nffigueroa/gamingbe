import { userShchema } from "../db/schemas/user";
import { ILoginCommands } from "../interfaces/Command";
import { IMongoDB } from "../interfaces/Mongo";
import { UserProfile } from "../interfaces/User.interface";
import { APPI_KEY, SALT_ROUNDS } from "../common/const";
import * as jwtLibrary from "jsonwebtoken";
const bcrypt = require("bcrypt");
export interface ResponseCreateUser {
  msg: string;
  status: Number;
}

export interface ResponseLogin {
  user: UserProfile | {};
  status: Number;
  tkn: string;
}

export class LoginCommands implements ILoginCommands {
  constructor(private mongoDb: IMongoDB) {}
  async createUser(user: UserProfile): Promise<ResponseCreateUser> {
    try {
      console.log(user);
      await this.mongoDb.connect();
      const emailAlreadyExists = await userShchema.findOne({
        email: user.email,
      });
      if (!!emailAlreadyExists) {
        return { msg: "Email Already Exists", status: 403 };
      } else {
        ///const salt = await bcrypt.genSalt(SALT_ROUNDS);
        user.password = await bcrypt.hash(user.password, SALT_ROUNDS);
        console.log("termino de hash");

        const userToSave = new userShchema(user);
        await userToSave.save();
        return { msg: "User Created", status: 200 };
      }
    } catch (error) {
      console.log(error);

      return { msg: error, status: 500 };
    }
  }

  async doLogin(email: string, password: string): Promise<ResponseLogin> {
    try {
      await this.mongoDb.connect();
      const userSelected: UserProfile = await userShchema.findOne({ email });
      if (!userSelected) {
        return {
          user: {},
          status: 404,
          tkn: "",
        };
      }
      const passWordMatches = this.comparePassword(
        password,
        userSelected.password ?? ""
      );

      userSelected.password = "*********";
      const getJWT = () => {
        return jwtLibrary.sign(
          {
            data: Object.assign({}, userSelected),
            exp: Math.floor(Date.now() / 1000) + 60 * 60,
          },
          "a6fe0907484eb0056c5cadd79386539a"
        );
      };
      return passWordMatches
        ? {
            user: userSelected,
            status: 200,
            tkn: getJWT(),
          }
        : { user: {}, status: 401, tkn: "" };
    } catch (error) {
      console.log(error);

      return {
        user: {},
        status: 500,
        tkn: "",
      };
    }
  }

  comparePassword(plainPassword: string, passwordEncrypted: string): Boolean {
    console.log(bcrypt.compare(plainPassword, passwordEncrypted));

    return bcrypt.compare(plainPassword, passwordEncrypted);
  }
}
