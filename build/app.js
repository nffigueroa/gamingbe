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
const express = require("express");
const bodyParser = __importStar(require("body-parser"));
const search_command_1 = require("./commands/search.command");
const index_1 = require("./index");
let app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.all("/*", (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requeted-With, Content-Type, Accept, Authorization, RBR");
    if (req.headers.origin) {
        res.header("Access-Control-Allow-Origin", req.headers.origin);
    }
    if (req.method === "OPTIONS") {
        res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE");
        return res.status(200).json({});
    }
    next();
});
app.get(`/gaming/search`, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name } = req.query;
    const index = new index_1.IndexPuppeteer(new search_command_1.Invoker());
    const response = yield index.calculate(name);
    res.send({ response });
}));
app.get(`/gaming/search/initial`, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const index = new index_1.IndexPuppeteer(new search_command_1.Invoker());
    const response = yield index.getInitialResults();
    res.send({ response });
}));
app.get(`/gaming/category/list`, (req, res, next) => {
    const index = new index_1.IndexPuppeteer(new search_command_1.Invoker());
    const response = index.getCategories();
    res.send({ response });
});
app.get(`/gaming/search/category`, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { categoryName } = req.query;
    const index = new index_1.IndexPuppeteer(new search_command_1.Invoker());
    const response = yield index.getProductByCategory(categoryName);
    res.send(Object.assign({}, response));
}));
const http = require("http").createServer(app);
const PORT = process.env.PORT || 3001;
http.listen(PORT, () => {
    console.log(`Running in http://localhost:${PORT}`);
});
