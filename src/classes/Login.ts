import {
  LoginCommands,
  ResponseCreateUser,
  ResponseLogin,
} from "../commands/login.command";
import { ILoginCommands } from "../interfaces/Command";
import { IMongoDB } from "../interfaces/Mongo";
import { UserProfile } from "../interfaces/User.interface";

export class Login implements ILoginCommands {
  constructor(private commands: LoginCommands) {}

  async createUser(user: UserProfile): Promise<ResponseCreateUser> {
    const response: ResponseCreateUser = await this.commands.createUser(user);
    return response;
  }

  async doLogin(email: string, password: string): Promise<ResponseLogin> {
    return await this.commands.doLogin(email, password);
  }
}
