import { IMongoDB } from "../interfaces/Mongo";

import mongoose from "mongoose";

export class MongoConexion implements IMongoDB {
  private db = mongoose.connection;
  constructor() {
    this.db.once("open", () => {
      console.log("Connected");
    });
  }

  async connect() {
    return await mongoose.connect(
      "mongodb+srv://gamershop:gamershopsas@cluster0.6dy3t.mongodb.net/test",
      { useNewUrlParser: true, useUnifiedTopology: true }
    );
  }
}
