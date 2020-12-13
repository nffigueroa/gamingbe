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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IndexPuppeteer = void 0;
var ImagenWorld_1 = require("./classes/ImagenWorld");
var SpeedLogic_1 = require("./classes/SpeedLogic");
var Tauret_1 = require("./classes/Tauret");
var puppeteer_1 = require("./common/puppeteer");
var admin = __importStar(require("firebase-admin"));
var ClonesYPerifericos_1 = require("./classes/ClonesYPerifericos");
var GamersColombia_1 = require("./classes/GamersColombia");
var serviceAccount = require("./heyapp-93526-firebase-adminsdk-8k2b8-c30462ed1a.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://heyapp-93526.firebaseio.com/",
});
var dbFB = admin.database();
var IndexPuppeteer = /** @class */ (function () {
    function IndexPuppeteer() {
    }
    IndexPuppeteer.prototype.getInitialResults = function () {
        return __awaiter(this, void 0, void 0, function () {
            var pup, filtered, r, dbFromFB, maxRandom, i, _a, response;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        pup = new puppeteer_1.PuppeteerService();
                        filtered = [];
                        return [4 /*yield*/, dbFB.ref("totalProducts").once("value")];
                    case 1:
                        r = _b.sent();
                        dbFromFB = r.val();
                        maxRandom = Array(5).fill(1);
                        maxRandom.forEach(function () {
                            var positionRandom = Math.round(Math.random() * (dbFromFB.length - 1) + 1);
                            console.log(positionRandom);
                            filtered.push(dbFromFB[positionRandom]);
                        });
                        console.log(filtered);
                        i = 0;
                        _b.label = 2;
                    case 2:
                        if (!(i < filtered.length)) return [3 /*break*/, 5];
                        _a = filtered[i];
                        return [4 /*yield*/, pup.getImage(filtered[i].name)];
                    case 3:
                        _a.image = _b.sent();
                        console.log("Ejecucion " + i + " de" + filtered.length, !!filtered[i].image);
                        _b.label = 4;
                    case 4:
                        i++;
                        return [3 /*break*/, 2];
                    case 5:
                        response = {
                            response: filtered,
                            sponsors: this.calculateSponsors(filtered),
                            status: !filtered.length ? 404 : 200,
                        };
                        return [2 /*return*/, response];
                }
            });
        });
    };
    IndexPuppeteer.prototype.calculate = function (itemToSearch) {
        return __awaiter(this, void 0, void 0, function () {
            var filtered, r, dbFromFB, speed, imagen, tauret, cyp, gamerColombia, pup, i, _a, response;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        filtered = [];
                        return [4 /*yield*/, dbFB.ref("totalProducts").once("value")];
                    case 1:
                        r = _b.sent();
                        dbFromFB = r.val();
                        if (!(!dbFromFB || !dbFromFB.length)) return [3 /*break*/, 7];
                        console.log(dbFromFB);
                        return [4 /*yield*/, new SpeedLogic_1.SpeedLogic().getTable()];
                    case 2:
                        speed = _b.sent();
                        return [4 /*yield*/, new ImagenWorld_1.ImagenWorld().getTable()];
                    case 3:
                        imagen = _b.sent();
                        return [4 /*yield*/, new Tauret_1.Tauret().getTable()];
                    case 4:
                        tauret = _b.sent();
                        return [4 /*yield*/, new ClonesYPerifericos_1.ClonesYPerifericos().getTable()];
                    case 5:
                        cyp = _b.sent();
                        return [4 /*yield*/, new GamersColombia_1.GamerColombia().getTable()];
                    case 6:
                        gamerColombia = _b.sent();
                        dbFromFB = speed
                            .concat(gamerColombia)
                            .concat(imagen)
                            .concat(tauret)
                            .concat(cyp);
                        dbFB.ref("totalProducts").set(dbFromFB);
                        _b.label = 7;
                    case 7:
                        pup = new puppeteer_1.PuppeteerService();
                        filtered = dbFromFB.filter(function (item) {
                            return item.name &&
                                item.name.toUpperCase().includes(itemToSearch.toUpperCase());
                        });
                        console.log(filtered);
                        i = 0;
                        _b.label = 8;
                    case 8:
                        if (!(i < filtered.length)) return [3 /*break*/, 11];
                        _a = filtered[i];
                        return [4 /*yield*/, pup.getImage(filtered[i].name)];
                    case 9:
                        _a.image = _b.sent();
                        console.log("Ejecucion " + i + " de" + filtered.length, !!filtered[i].image);
                        _b.label = 10;
                    case 10:
                        i++;
                        return [3 /*break*/, 8];
                    case 11:
                        response = {
                            response: filtered,
                            sponsors: this.calculateSponsors(filtered),
                            status: !filtered.length ? 404 : 200,
                        };
                        return [2 /*return*/, response];
                }
            });
        });
    };
    IndexPuppeteer.prototype.calculateSponsors = function (arr) {
        var result = arr.map(function (item) { return item.seller; });
        var seen = new Set();
        return result.filter(function (item) {
            var duplicate = seen.has(item.key);
            seen.add(item.key);
            return !duplicate;
        });
    };
    return IndexPuppeteer;
}());
exports.IndexPuppeteer = IndexPuppeteer;
