import mongoose from "mongoose";
const Schema = mongoose.Schema;
const schema = new Schema({
  firstName: String,
  lastName: String,
  email: String,
  password: String,
  sendNotifications: Boolean,
  products: Array,
});

export const userShchema = mongoose.model("user", schema);
