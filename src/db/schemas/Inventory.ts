import mongoose from "mongoose";
const Schema = mongoose.Schema;
const schema = new Schema({
  name: String,
  value: String,
  seller: Object,
  category: String,
  image: String,
  urlRefer: String,
});

export const inventorySchema = mongoose.model("Inventory", schema);
