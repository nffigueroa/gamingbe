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
exports.GamerColombia = void 0;
const puppeteer_1 = __importDefault(require("puppeteer"));
class GamerColombia {
    constructor() {
        this.URL = "https://gamerscolombia.com/tienda?order=1&paginate=48&page=1&export=0&minPrice=30000&maxPrice=9999999";
        this.COMPANY_NAME = "gamercolombia";
    }
    getTable() {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.connect(this.URL, "#formFilterProduct > div > div.container.padding-top-1x.padding-bottom-3x > div > div.col-lg-9.order-lg-2 > div.isotope-grid.cols-3");
            return response;
        });
    }
    connect(url, tableTarget) {
        return __awaiter(this, void 0, void 0, function* () {
            const browser = yield puppeteer_1.default.launch();
            const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
            const page = yield browser.newPage();
            yield page.setUserAgent("Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36");
            yield page.goto(url, { waitUntil: "domcontentloaded" });
            yield page.setViewport({ width: 1366, height: 768 });
            const pageCount = yield page.evaluate(() => {
                var _a;
                return (_a = document.querySelector("#formFilterProduct > div > div.container.padding-top-1x.padding-bottom-3x > div > div.col-lg-9.order-lg-2 > nav > div > div > ul")) === null || _a === void 0 ? void 0 : _a.children.length;
            });
            let fullResult = [];
            for (let i = 1; i < pageCount; i++) {
                yield page.click(`#formFilterProduct > div > div.container.padding-top-1x.padding-bottom-3x > div > div.col-lg-9.order-lg-2 > nav > div > div > ul > li:nth-child(${i})`);
                yield page.waitForSelector(tableTarget);
                yield page.screenshot({ path: "screenshot.png", fullPage: true });
                const data = yield page.evaluate((table, company) => {
                    var _a;
                    let result = [];
                    const rows = (_a = document
                        .querySelector(table)) === null || _a === void 0 ? void 0 : _a.querySelectorAll('div[class="grid-item"]');
                    for (let j = 0; j < rows.length; j++) {
                        const { innerText: name, href: url } = rows[j]
                            .querySelector('h3[class="product-title"]')
                            .getElementsByTagName("a")[0];
                        const value = Number(rows[j]
                            .querySelector('h4[class="product-price"]')
                            .getElementsByTagName("span")[0]
                            .innerText.replace("$", "")
                            .replace(/,/g, "")
                            .replace(/\n/g, ""));
                        result.push({
                            name,
                            value,
                            url,
                            seller: { name: "Gamers Colombia", key: company },
                        });
                    }
                    return result;
                }, tableTarget, this.COMPANY_NAME);
                fullResult = fullResult.concat(data);
            }
            yield browser.close();
            return fullResult;
        });
    }
}
exports.GamerColombia = GamerColombia;
