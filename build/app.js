"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var express = require("express");
var bodyParser = __importStar(require("body-parser"));
var search_command_1 = require("./commands/search.command");
var index_1 = require("./index");
var app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.all("/*", function (req, res, next) {
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
app.get("/gaming/search", function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var name, index, response;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                name = req.query.name;
                index = new index_1.IndexPuppeteer(new search_command_1.Invoker());
                return [4 /*yield*/, index.calculate(name)];
            case 1:
                response = _a.sent();
                res.send({ response: response });
                return [2 /*return*/];
        }
    });
}); });
app.get("/gaming/search/initial", function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var index, response;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                index = new index_1.IndexPuppeteer(new search_command_1.Invoker());
                return [4 /*yield*/, index.getInitialResults()];
            case 1:
                response = _a.sent();
                res.send({ response: response });
                return [2 /*return*/];
        }
    });
}); });
app.get("/gaming/category/list", function (req, res, next) {
    var index = new index_1.IndexPuppeteer(new search_command_1.Invoker());
    var response = index.getCategories();
    res.send({ response: response });
});
app.get("/gaming/search/category", function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var categoryName, index, response;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                categoryName = req.query.categoryName;
                index = new index_1.IndexPuppeteer(new search_command_1.Invoker());
                return [4 /*yield*/, index.getProductByCategory(categoryName)];
            case 1:
                response = _a.sent();
                res.send(__assign({}, response));
                return [2 /*return*/];
        }
    });
}); });
var http = require("http").createServer(app);
var PORT = 3001;
http.listen(PORT, function () {
    console.log("Running in http://localhost:" + PORT);
});
