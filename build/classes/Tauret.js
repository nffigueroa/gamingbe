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
exports.Tauret = void 0;
const puppeteer_1 = __importDefault(require("puppeteer"));
class Tauret {
    constructor() {
        this.URL = "https://tauretcomputadores.com/lista-de-precios";
        this.COMPANY_NAME = "tauretcomputadores";
    }
    getTable() {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.connect(this.URL, "#areaImprimir > div", "");
            return response;
        });
    }
    connect(url, tableTarget, tr) {
        return __awaiter(this, void 0, void 0, function* () {
            const browser = yield puppeteer_1.default.launch();
            const page = yield browser.newPage();
            yield page.setUserAgent("Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36");
            yield page.setViewport({ width: 1366, height: 768 });
            yield page.goto(url);
            const data = yield page.evaluate((table, company) => {
                var _a;
                const rows = (_a = document.querySelector(table)) === null || _a === void 0 ? void 0 : _a.children;
                const result = [];
                for (let i = 1; i < rows.length; i++) {
                    const grid = rows[i].querySelectorAll(`#areaImprimir > div > div:nth-child(${i + 1}) > div.product_prod`);
                    for (let j = 0; j < grid.length; j++) {
                        const name = rows[i]
                            .querySelectorAll(`#areaImprimir > div > div:nth-child(${i + 1}) > div.product_prod`)[j].getElementsByTagName("a")[0].innerText;
                        const value = Number(rows[i]
                            .querySelectorAll(`#areaImprimir > div > div:nth-child(${i + 1}) > div.product_prod`)[j].getElementsByTagName("div")[0]
                            .innerText.replace("COP", "")
                            .replace(/,/g, ""));
                        result.push({
                            name,
                            value,
                            seller: { name: "Tauret Computadores", key: company },
                        });
                    }
                }
                return result;
            }, tableTarget, this.COMPANY_NAME);
            yield browser.close();
            return data;
        });
    }
}
exports.Tauret = Tauret;
