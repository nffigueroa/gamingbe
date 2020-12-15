"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Invoker = void 0;
const ClonesYPerifericos_1 = require("../classes/ClonesYPerifericos");
const GamersColombia_1 = require("../classes/GamersColombia");
const ImagenWorld_1 = require("../classes/ImagenWorld");
const SpeedLogic_1 = require("../classes/SpeedLogic");
const Tauret_1 = require("../classes/Tauret");
const puppeteer_1 = require("../common/puppeteer");
const const_1 = require("../common/const");
class Invoker {
    getImages(arr) {
        return __awaiter(this, void 0, void 0, function* () {
            const pup = new puppeteer_1.PuppeteerService();
            for (let i = 0; i < arr.length; i++) {
                if (!arr[i].name) {
                    console.log("Ejecucion " + i + " de " + arr.length, !!arr[i].image);
                    continue;
                }
                arr[i].image = arr[i].image || (yield pup.getImage(arr[i].name));
                console.log("Ejecucion " + i + " de " + arr.length, !!arr[i].image);
            }
            return arr;
        });
    }
    scrapInventories() {
        return __awaiter(this, void 0, void 0, function* () {
            const speed = yield new SpeedLogic_1.SpeedLogic().getTable();
            const imagen = yield new ImagenWorld_1.ImagenWorld().getTable();
            const tauret = yield new Tauret_1.Tauret().getTable();
            const cyp = yield new ClonesYPerifericos_1.ClonesYPerifericos().getTable();
            const gamerColombia = yield new GamersColombia_1.GamerColombia().getTable();
            return speed
                .concat(gamerColombia)
                .concat(imagen)
                .concat(tauret)
                .concat(cyp);
        });
    }
    calculateSponsors(arr) {
        const result = arr.map((item) => item.seller);
        const seen = new Set();
        return result.filter((item) => {
            const duplicate = seen.has(item.key);
            seen.add(item.key);
            return !duplicate;
        });
    }
    filterByName(db, itemToSearch) {
        return db.filter((item) => item.name &&
            item.name.toUpperCase().includes(itemToSearch.toUpperCase()));
    }
    getCategoryByName(name) {
        console.log(name + "111");
        const r = const_1.CATEGORIES.filter(({ keys }) => !!keys.filter((key) => name.trim().toUpperCase().includes(key.toUpperCase())).length)[0].categoryName;
        console.log(r);
        return const_1.CATEGORIES.filter(({ keys }) => !!keys.filter((key) => name.trim().toUpperCase().includes(key.toUpperCase())).length)[0].categoryName;
    }
}
exports.Invoker = Invoker;
