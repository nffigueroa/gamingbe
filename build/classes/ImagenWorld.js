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
exports.ImagenWorld = void 0;
const puppeteer_1 = __importDefault(require("puppeteer"));
class ImagenWorld {
    constructor() {
        this.URL = "https://www.imagenworld.com/xapps/listaprecios/3/a";
        this.companyName = "imgworld";
    }
    getTable() {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.connect(this.URL, "#axtListaPrecios", "");
            return response;
        });
    }
    connect(url, tableTarget, tr) {
        return __awaiter(this, void 0, void 0, function* () {
            this.browser = yield puppeteer_1.default.launch();
            this.page = yield this.browser.newPage();
            yield this.page.setUserAgent("Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36");
            yield this.page.setViewport({ width: 1366, height: 768 });
            yield this.page.goto(url);
            const data = yield this.page.evaluate((table, companyName) => {
                var _a;
                const rows = (_a = document
                    .querySelector(table)) === null || _a === void 0 ? void 0 : _a.querySelectorAll('[role="row"]');
                let result = [];
                for (let i = 0; i < rows.length; i++) {
                    let name;
                    if (rows[i].querySelectorAll("td").length > 2) {
                        name = rows[i].querySelectorAll("td")[1].innerText;
                    }
                    else {
                        name = rows[i].querySelectorAll("td")[0].innerText;
                    }
                    const value = Number(rows[i]
                        .querySelectorAll("td")[2]
                        .innerText.replace("$", "")
                        .replace(/,/g, ""));
                    result.push({
                        name,
                        value,
                        seller: { name: "Imagen World", key: companyName },
                    });
                }
                return result;
            }, tableTarget, this.companyName);
            yield this.browser.close();
            return data;
        });
    }
}
exports.ImagenWorld = ImagenWorld;
