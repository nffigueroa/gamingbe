import { IProducts } from "../interfaces/Products";
import puppeteer from "puppeteer";
import { ItemProduct } from "../interfaces/ItemProduct";

export class SpeedLogic implements IProducts {
  private URL = "https://partes.speedlogic.com.co/";
  private COMPANY_NAME = "speedlogic";
  page: any;
  browser: any;
  result: any;
  constructor() {}

  async getTable(): Promise<Array<ItemProduct>> {
    const response: any = await this.connect(this.URL, "#SPEED_17140 > table");
    return response;
  }

  async connect(url: string, tableTarget: string) {
    const browser = await puppeteer.launch();

    const page = await browser.newPage();

    await page.setUserAgent(
      "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36"
    );

    await page.setViewport({ width: 1366, height: 768 });
    await page.goto(url);
    const data = await page.evaluate(
      (table: string, company) => {
        let result: Array<any> = [];
        const rows: any = document
          .querySelector("body")
          ?.getElementsByTagName("table")[0]
          .querySelectorAll('tr[height="16"]');
        rows.forEach((item: any, index: number) => {
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
      },
      tableTarget,
      this.COMPANY_NAME
    );

    await browser.close();
    return data;
  }
}
