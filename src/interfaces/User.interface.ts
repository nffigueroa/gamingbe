import { ItemProduct } from "./ItemProduct";

export interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  sendNotifications: boolean;
  products: Array<string>;
}
