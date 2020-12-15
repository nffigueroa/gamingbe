const express = require("express");
import * as bodyParser from "body-parser";
import { Invoker } from "./commands/search.command";
import { IndexPuppeteer } from "./index";

let app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.all("/*", (req: any, res: any, next: any) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requeted-With, Content-Type, Accept, Authorization, RBR"
  );
  if (req.headers.origin) {
    res.header("Access-Control-Allow-Origin", req.headers.origin);
  }
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE");
    return res.status(200).json({});
  }
  next();
});

app.get(`/gaming/search`, async (req: any, res: any, next: any) => {
  const { name } = req.query;
  const index = new IndexPuppeteer(new Invoker());
  const response = await index.calculate(name);
  res.send({ response });
});
app.get(`/gaming/search/initial`, async (req: any, res: any, next: any) => {
  const index = new IndexPuppeteer(new Invoker());
  const response = await index.getInitialResults();
  res.send({ response });
});
app.get(`/gaming/category/list`, (req: any, res: any, next: any) => {
  const index = new IndexPuppeteer(new Invoker());
  const response = index.getCategories();
  res.send({ response });
});
app.get(`/gaming/search/category`, async (req: any, res: any, next: any) => {
  const { categoryName } = req.query;
  const index = new IndexPuppeteer(new Invoker());
  const response = await index.getProductByCategory(categoryName);
  res.send({ ...response });
});

const http = require("http").createServer(app);
const PORT = 3001;
http.listen(PORT, () => {
  console.log(`Running in http://localhost:${PORT}`);
});
