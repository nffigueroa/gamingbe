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
exports.ClonesYPerifericos = void 0;
const puppeteer_1 = __importDefault(require("puppeteer"));
class ClonesYPerifericos {
    constructor() {
        this.URL = "https://clonesyperifericos.com/tienda/";
        this.COMPANY_NAME = "clonesyperifericos";
    }
    getTable() {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.connect(this.URL, "body > div.template-container > div.template-content > div.page-wrapper > div.container.sidebar-mobile-bottom.content-page.products-hover-only-icons > div > div > div.content.main-products-loop.col-md-9.col-md-push-3 > div.row.products-loop.products-grid.row-count-4", "");
            return response;
        });
    }
    connect(url, tableTarget, tr) {
        return __awaiter(this, void 0, void 0, function* () {
            const elementToDissapear = "body > div.template-container > div.template-content > div.page-wrapper > div.container.sidebar-mobile-bottom.content-page.products-hover-only-icons > div > div > div.content.main-products-loop.col-md-9.col-md-push-3 > div.after-shop-loop > nav > ul > li:nth-child(1) > span";
            const browser = yield puppeteer_1.default.launch();
            const page = yield browser.newPage();
            yield page.setUserAgent("Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36");
            yield page.goto(url, { waitUntil: "domcontentloaded" });
            yield page.setViewport({ width: 1366, height: 768 });
            yield page.select("body > div.template-container > div.template-content > div.page-wrapper > div.container.sidebar-mobile-bottom.content-page.products-hover-only-icons > div > div > div.content.main-products-loop.col-md-9.col-md-push-3 > div.filter-wrap > div > div.products-per-page.et-hidden-phone > form > select", "-1");
            yield page.$eval("body > div.template-container > div.template-content > div.page-wrapper > div.container.sidebar-mobile-bottom.content-page.products-hover-only-icons > div > div > div.content.main-products-loop.col-md-9.col-md-push-3 > div.filter-wrap > div > div.products-per-page.et-hidden-phone > form", (form) => form.submit());
            yield page.waitForSelector(elementToDissapear, { hidden: true });
            const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
            yield wait(2000);
            const data = yield page.evaluate((table, company) => {
                var _a;
                const rows = (_a = document.querySelector(table)) === null || _a === void 0 ? void 0 : _a.children;
                const result = [];
                for (let i = 0; i < rows.length; i++) {
                    const { innerText: name, href: url } = rows[i]
                        .querySelector('p[class="product-title"]')
                        .querySelector("a");
                    const value = rows[i]
                        .getElementsByTagName("span")[0]
                        .innerText.replace("$", "")
                        .replace(/,/g, "");
                    result.push({
                        name,
                        url,
                        value,
                        seller: { name: "Clones y Perifericos", key: company },
                    });
                }
                return result;
            }, tableTarget, this.COMPANY_NAME);
            yield browser.close();
            return data;
        });
    }
}
exports.ClonesYPerifericos = ClonesYPerifericos;
