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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpeedLogic = void 0;
const puppeteer_1 = __importDefault(require("puppeteer"));
class SpeedLogic {
    constructor() {
        this.URL = "https://partes.speedlogic.com.co/";
        this.COMPANY_NAME = "speedlogic";
    }
    getTable() {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.connect(this.URL, "#SPEED_17140 > table");
            return response;
        });
    }
    connect(url, tableTarget) {
        return __awaiter(this, void 0, void 0, function* () {
            const browser = yield puppeteer_1.default.launch();
            const page = yield browser.newPage();
            yield page.setUserAgent("Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36");
            yield page.setViewport({ width: 1366, height: 768 });
            yield page.goto(url);
            const data = yield page.evaluate((table, company) => {
                var _a;
                let result = [];
                const rows = (_a = document
                    .querySelector("body")) === null || _a === void 0 ? void 0 : _a.getElementsByTagName("table")[0].querySelectorAll('tr[height="16"]');
                rows.forEach((item, index) => {
                    if (item.querySelectorAll("td").length < 5) {
                        return;
                    }
                    const nameA = item.querySelectorAll("td")[0].innerText;
                    const valueA = item
                        .querySelectorAll("td")[1]
                        .innerText.replace("COP", "")
                        .replace(/,/g, "");
                    result.push({
                        name: nameA,
                        value: Number(valueA * 1000),
                        seller: {
                            name: "SpeedLogic",
                            key: company,
                        },
                    });
                    const nameB = item.querySelectorAll("td")[3].innerText;
                    const valueB = item
                        .querySelectorAll("td")[4]
                        .innerText.replace("COP", "")
                        .replace(/,/g, "");
                    result.push({
                        name: nameB,
                        value: Number(valueB * 1000),
                        seller: {
                            name: "SpeedLogic",
                            key: company,
                        },
                    });
                });
                return result;
            }, tableTarget, this.COMPANY_NAME);
            yield browser.close();
            return data;
        });
    }
}
exports.SpeedLogic = SpeedLogic;
