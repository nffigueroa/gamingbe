import { PuppeteerService } from "../common/puppeteer";
import { IProducts } from "../interfaces/Products";
import puppeteer from "puppeteer";
import { ItemProduct } from "../interfaces/ItemProduct";

export class ImagenWorld implements IProducts {
  private URL = "https://www.imagenworld.com/xapps/listaprecios/3/a";
  private companyName = "imgworld";
  page: any;
  browser: any;
  result: any;
  constructor() {}

  async getTable(): Promise<Array<ItemProduct>> {
    const response: any = await this.connect(this.URL, "#axtListaPrecios", "");
    return response;
  }

  async connect(url: string, tableTarget: string, tr: string) {
    this.browser = await puppeteer.launch();

    this.page = await this.browser.newPage();

    await this.page.setUserAgent(
      "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36"
    );

    await this.page.setViewport({ width: 1366, height: 768 });
    await this.page.goto(url);
    const data = await this.page.evaluate(
      (table: string, companyName: string) => {
        const rows: any = document
          .querySelector(table)
          ?.querySelectorAll('[role="row"]');
        let result = [];
        for (let i = 0; i < rows.length; i++) {
          let name;
          if (rows[i].querySelectorAll("td").length > 2) {
            name = rows[i].querySelectorAll("td")[1].innerText;
          } else {
            name = rows[i].querySelectorAll("td")[0].innerText;
          }

          const value = Number(
            rows[i]
              .querySelectorAll("td")[2]
              .innerText.replace("$", "")
              .replace(/,/g, "")
          );
          result.push({
            name,
            value,
            seller: { name: "Imagen World", key: companyName },
          });
        }

        return result;
      },
      tableTarget,
      this.companyName
    );

    await this.browser.close();
    return data;
  }
}
