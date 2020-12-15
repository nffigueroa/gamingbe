"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.IndexPuppeteer = void 0;
const puppeteer_1 = require("./common/puppeteer");
const admin = __importStar(require("firebase-admin"));
const const_1 = require("./common/const");
var serviceAccount = require("./heyapp-93526-firebase-adminsdk-8k2b8-c30462ed1a.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://heyapp-93526.firebaseio.com/",
});
const dbFB = admin.database();
class IndexPuppeteer {
    constructor(commands) {
        this.commands = commands;
    }
    getInitialResults() {
        return __awaiter(this, void 0, void 0, function* () {
            const pup = new puppeteer_1.PuppeteerService();
            let filtered = [];
            const r = yield dbFB.ref("totalProducts").once("value");
            let dbFromFB = r.val();
            const maxRandom = Array(5).fill(1);
            maxRandom.forEach(() => {
                const positionRandom = Math.round(Math.random() * (dbFromFB.length - 1) + 1);
                console.log(positionRandom);
                filtered.push(dbFromFB[positionRandom]);
            });
            console.log(filtered);
            for (let i = 0; i < filtered.length; i++) {
                filtered[i].image = yield pup.getImage(filtered[i].name);
                console.log("Ejecucion " + i + " de" + filtered.length, !!filtered[i].image);
            }
            const response = {
                response: filtered,
                sponsors: this.commands.calculateSponsors(filtered),
                status: !filtered.length ? 404 : 200,
            };
            return response;
        });
    }
    calculate(itemToSearch) {
        return __awaiter(this, void 0, void 0, function* () {
            let filtered = [];
            const r = yield dbFB.ref("totalProducts").once("value");
            //let dbFromFB: Array<any> = []; // Remove for fetching all the db []
            let dbFromFB = r.val(); // Remove for fetching all the db []
            if (!dbFromFB || !dbFromFB.length) {
                dbFromFB = yield this.commands.scrapInventories();
                dbFB.ref("totalProducts").set(dbFromFB);
            }
            //dbFromFB = await this.commands.getImages(dbFromFB);
            //dbFB.ref("totalProducts").update(dbFromFB);
            filtered = this.commands.filterByName(dbFromFB, itemToSearch);
            /*filtered = dbFromFB.map((item: ItemProduct) => ({
              ...item,
              category:
                Number(item.value) > 0 && item.name
                  ? this.commands.getCategoryByName(item.name)
                  : "",
            }));*/
            //dbFB.ref("totalProducts").update(filtered);
            const response = {
                response: filtered,
                sponsors: this.commands.calculateSponsors(filtered),
                status: !filtered.length ? 404 : 200,
            };
            return response;
        });
    }
    getCategories() {
        return {
            data: {
                categories: const_1.CATEGORIES.map((item) => item.categoryName),
            },
            status: !const_1.CATEGORIES.length ? 404 : 200,
        };
    }
    getProductByCategory(category) {
        return __awaiter(this, void 0, void 0, function* () {
            const r = yield dbFB.ref("totalProducts").once("value");
            let dbFromFB = r.val();
            const data = dbFromFB.filter((item) => { var _a; return ((_a = item.category) === null || _a === void 0 ? void 0 : _a.toUpperCase()) === category.toUpperCase(); });
            const sponsors = this.commands.calculateSponsors(data);
            return {
                data,
                sponsors,
                status: !data.length ? 404 : 200,
            };
        });
    }
}
exports.IndexPuppeteer = IndexPuppeteer;
