import { IProducts } from "../interfaces/Products";
import puppeteer from "puppeteer";
import { ItemProduct } from "../interfaces/ItemProduct";
export class Tauret implements IProducts {
  private URL = "https://tauretcomputadores.com/lista-de-precios";
  private COMPANY_NAME = "tauretcomputadores";
  constructor() {}

  async getTable(): Promise<Array<ItemProduct>> {
    const response: any = await this.connect(
      this.URL,
      "#areaImprimir > div",
      ""
    );
    return response;
  }

  async connect(url: string, tableTarget: string, tr: string) {
    const browser = await puppeteer.launch();

    const page = await browser.newPage();

    await page.setUserAgent(
      "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36"
    );

    await page.setViewport({ width: 1366, height: 768 });
    await page.goto(url);
    const data = await page.evaluate(
      (table: string, company: string) => {
        const rows: any = document.querySelector(table)?.children;

        const result = [];
        for (let i = 1; i < rows.length; i++) {
          const grid = rows[i].querySelectorAll(
            `#areaImprimir > div > div:nth-child(${i + 1}) > div.product_prod`
          );
          for (let j = 0; j < grid.length; j++) {
            const { innertText: name, href: url } = rows[i]
              .querySelectorAll(
                `#areaImprimir > div > div:nth-child(${
                  i + 1
                }) > div.product_prod`
              )
              [j].getElementsByTagName("a")[0];
            const value = Number(
              rows[i]
                .querySelectorAll(
                  `#areaImprimir > div > div:nth-child(${
                    i + 1
                  }) > div.product_prod`
                )
                [j].getElementsByTagName("div")[0]
                .innerText.replace("COP", "")
                .replace(/,/g, "")
            );
            result.push({
              name,
              value,
              seller: { name: "Tauret Computadores", key: company },
              url,
            });
          }
        }
        return result;
      },
      tableTarget,
      this.COMPANY_NAME
    );
    console.log(`${this.COMPANY_NAME} Success`);
    await browser.close();
    return data;
  }
}
