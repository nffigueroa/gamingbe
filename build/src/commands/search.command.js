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
exports.Invoker = void 0;
var ClonesYPerifericos_1 = require("../classes/ClonesYPerifericos");
var GamersColombia_1 = require("../classes/GamersColombia");
var ImagenWorld_1 = require("../classes/ImagenWorld");
var SpeedLogic_1 = require("../classes/SpeedLogic");
var Tauret_1 = require("../classes/Tauret");
var puppeteer_1 = require("../common/puppeteer");
var const_1 = require("../common/const");
var Invoker = /** @class */ (function () {
    function Invoker() {
    }
    Invoker.prototype.getImages = function (arr) {
        return __awaiter(this, void 0, void 0, function () {
            var pup, i, _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        pup = new puppeteer_1.PuppeteerService();
                        i = 0;
                        _c.label = 1;
                    case 1:
                        if (!(i < arr.length)) return [3 /*break*/, 5];
                        if (!arr[i].name) {
                            console.log("Ejecucion " + i + " de " + arr.length, !!arr[i].image);
                            return [3 /*break*/, 4];
                        }
                        _a = arr[i];
                        _b = arr[i].image;
                        if (_b) return [3 /*break*/, 3];
                        return [4 /*yield*/, pup.getImage(arr[i].name)];
                    case 2:
                        _b = (_c.sent());
                        _c.label = 3;
                    case 3:
                        _a.image = _b;
                        console.log("Ejecucion " + i + " de " + arr.length, !!arr[i].image);
                        _c.label = 4;
                    case 4:
                        i++;
                        return [3 /*break*/, 1];
                    case 5: return [2 /*return*/, arr];
                }
            });
        });
    };
    Invoker.prototype.scrapInventories = function () {
        return __awaiter(this, void 0, void 0, function () {
            var speed, imagen, tauret, cyp, gamerColombia;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, new SpeedLogic_1.SpeedLogic().getTable()];
                    case 1:
                        speed = _a.sent();
                        return [4 /*yield*/, new ImagenWorld_1.ImagenWorld().getTable()];
                    case 2:
                        imagen = _a.sent();
                        return [4 /*yield*/, new Tauret_1.Tauret().getTable()];
                    case 3:
                        tauret = _a.sent();
                        return [4 /*yield*/, new ClonesYPerifericos_1.ClonesYPerifericos().getTable()];
                    case 4:
                        cyp = _a.sent();
                        return [4 /*yield*/, new GamersColombia_1.GamerColombia().getTable()];
                    case 5:
                        gamerColombia = _a.sent();
                        return [2 /*return*/, speed
                                .concat(gamerColombia)
                                .concat(imagen)
                                .concat(tauret)
                                .concat(cyp)];
                }
            });
        });
    };
    Invoker.prototype.calculateSponsors = function (arr) {
        var result = arr.map(function (item) { return item.seller; });
        var seen = new Set();
        return result.filter(function (item) {
            var duplicate = seen.has(item.key);
            seen.add(item.key);
            return !duplicate;
        });
    };
    Invoker.prototype.filterByName = function (db, itemToSearch) {
        return db.filter(function (item) {
            return item.name &&
                item.name.toUpperCase().includes(itemToSearch.toUpperCase());
        });
    };
    Invoker.prototype.getCategoryByName = function (name) {
        console.log(name + "111");
        var r = const_1.CATEGORIES.filter(function (_a) {
            var keys = _a.keys;
            return !!keys.filter(function (key) {
                return name.trim().toUpperCase().includes(key.toUpperCase());
            }).length;
        })[0].categoryName;
        console.log(r);
        return const_1.CATEGORIES.filter(function (_a) {
            var keys = _a.keys;
            return !!keys.filter(function (key) {
                return name.trim().toUpperCase().includes(key.toUpperCase());
            }).length;
        })[0].categoryName;
    };
    return Invoker;
}());
exports.Invoker = Invoker;
