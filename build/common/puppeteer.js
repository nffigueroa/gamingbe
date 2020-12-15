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
exports.PuppeteerService = void 0;
const puppeteer_1 = __importDefault(require("puppeteer"));
class PuppeteerService {
    constructor() { }
    getImage(name) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const firstImage = "#i9 > div.FAZ4xe.oQYlMd > span > div > div.Q2tIyd > div:nth-child(1) > c-wiz > div > a > div > div.T6b9se.eKtPwd > img";
                const browser = yield puppeteer_1.default.launch();
                const page = yield browser.newPage();
                yield page.setUserAgent("Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36");
                //await page.setViewport({ width: 1366, height: 768 });
                yield page.goto("https://www.google.com/imghp?hl=EN");
                yield page.focus('input[name="q"]');
                yield page.keyboard.type(name);
                yield page.keyboard.press("Enter");
                yield page.waitForSelector("#yDmH0d > div.T1diZc.KWE8qe > c-wiz > c-wiz > div > div > div > div.bMoG0d");
                const data = yield page.evaluate((firstImg) => {
                    var _a;
                    const imgBase = (_a = document
                        .querySelector("#yDmH0d > div.T1diZc.KWE8qe > c-wiz > c-wiz > div > div > div > div.bMoG0d")) === null || _a === void 0 ? void 0 : _a.querySelectorAll("img")[0].src;
                    return imgBase;
                }, firstImage);
                yield browser.close();
                return data;
            }
            catch (error) {
                return "";
            }
        });
    }
}
exports.PuppeteerService = PuppeteerService;
