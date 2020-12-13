import { ImagenWorld } from "./classes/ImagenWorld";
import { SpeedLogic } from "./classes/SpeedLogic";
import { Tauret } from "./classes/Tauret";
import { PuppeteerService } from "./common/puppeteer";
import { ItemProduct, Seller } from "./interfaces/ItemProduct";

import * as admin from "firebase-admin";
import { ResponseSearch } from "./interfaces/Responses";
import { ClonesYPerifericos } from "./classes/ClonesYPerifericos";
import { GamerColombia } from "./classes/GamersColombia";
var serviceAccount = require("./heyapp-93526-firebase-adminsdk-8k2b8-c30462ed1a.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://heyapp-93526.firebaseio.com/",
});

const dbFB = admin.database();

export class IndexPuppeteer {
  constructor() {}

  async getInitialResults(): Promise<ResponseSearch> {
    const pup = new PuppeteerService();
    let filtered: ItemProduct[] = [];
    const r = await dbFB.ref("totalProducts").once("value");
    let dbFromFB: Array<any> = r.val();
    const maxRandom = Array(5).fill(1);
    maxRandom.forEach(() => {
      const positionRandom = Math.round(
        Math.random() * (dbFromFB.length - 1) + 1
      );
      console.log(positionRandom);
      filtered.push(dbFromFB[positionRandom]);
    });
    console.log(filtered);
    for (let i = 0; i < filtered.length; i++) {
      filtered[i].image = await pup.getImage(filtered[i].name);

      console.log(
        "Ejecucion " + i + " de" + filtered.length,
        !!filtered[i].image
      );
    }

    const response: ResponseSearch = {
      response: filtered,
      sponsors: this.calculateSponsors(filtered),
      status: !filtered.length ? 404 : 200,
    };
    return response;
  }

  async calculate(itemToSearch: string): Promise<ResponseSearch> {
    let filtered = [];
    const r = await dbFB.ref("totalProducts").once("value");
    //let dbFromFB: Array<any> = []; // Remove for fetching all the db []
    let dbFromFB: Array<any> = r.val(); // Remove for fetching all the db []

    if (!dbFromFB || !dbFromFB.length) {
      console.log(dbFromFB);

      const speed = await new SpeedLogic().getTable();

      const imagen = await new ImagenWorld().getTable();

      const tauret = await new Tauret().getTable();

      const cyp = await new ClonesYPerifericos().getTable();

      const gamerColombia = await new GamerColombia().getTable();

      dbFromFB = speed
        .concat(gamerColombia)
        .concat(imagen)
        .concat(tauret)
        .concat(cyp);

      dbFB.ref("totalProducts").set(dbFromFB);
    }
    const pup = new PuppeteerService();
    filtered = dbFromFB.filter(
      (item: ItemProduct) =>
        item.name &&
        item.name.toUpperCase().includes(itemToSearch.toUpperCase())
    );

    for (let i = 0; i < filtered.length; i++) {
      filtered[i].image = await pup.getImage(filtered[i].name);

      console.log(
        "Ejecucion " + i + " de " + filtered.length,
        !!filtered[i].image
      );
    }
    const response: ResponseSearch = {
      response: filtered,
      sponsors: this.calculateSponsors(filtered),
      status: !filtered.length ? 404 : 200,
    };
    return response;
  }

  calculateSponsors(arr: Array<ItemProduct>): Array<Seller> {
    const result: Array<Seller> = arr.map((item: ItemProduct) => item.seller);
    const seen = new Set();
    return result.filter((item: Seller) => {
      const duplicate = seen.has(item.key);
      seen.add(item.key);
      return !duplicate;
    });
  }
}
