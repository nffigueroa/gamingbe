import { IProducts } from "../interfaces/Products";
import puppeteer from "puppeteer";
import { ItemProduct } from "../interfaces/ItemProduct";
export class GamerColombia implements IProducts {
  private URL =
    "https://gamerscolombia.com/tienda?order=1&paginate=48&page=1&export=0&minPrice=30000&maxPrice=9999999";
  private COMPANY_NAME = "gamercolombia";
  constructor() {}

  async getTable(): Promise<Array<ItemProduct>> {
    const response: any = await this.connect(
      this.URL,
      "#formFilterProduct > div > div.container.padding-top-1x.padding-bottom-3x > div > div.col-lg-9.order-lg-2 > div.isotope-grid.cols-3"
    );
    return response;
  }

  async connect(url: string, tableTarget: string) {
    const browser = await puppeteer.launch();
    const wait = (ms: number) =>
      new Promise((resolve) => setTimeout(resolve, ms));
    const page = await browser.newPage();

    await page.setUserAgent(
      "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36"
    );

    await page.goto(url, { waitUntil: "domcontentloaded" });
    await page.setViewport({ width: 1366, height: 768 });
    const pageCount: any = await page.evaluate(() => {
      return document.querySelector(
        "#formFilterProduct > div > div.container.padding-top-1x.padding-bottom-3x > div > div.col-lg-9.order-lg-2 > nav > div > div > ul"
      )?.children.length;
    });
    let fullResult: {
      name: any;
      value: any;
      url: any;
      seller: { name: string; key: any };
    }[] = [];
    for (let i = 1; i < pageCount; i++) {
      await page.waitForSelector(
        `#formFilterProduct > div > div.container.padding-top-1x.padding-bottom-3x > div > div.col-lg-9.order-lg-2 > nav > div > div > ul > li:nth-child(${i})`
      );
      await page.click(
        `#formFilterProduct > div > div.container.padding-top-1x.padding-bottom-3x > div > div.col-lg-9.order-lg-2 > nav > div > div > ul > li:nth-child(${i})`
      );
      await page.waitForSelector(tableTarget);
      await page.screenshot({ path: "screenshot.png", fullPage: true });
      const data = await page.evaluate(
        (table, company) => {
          let result = [];
          const rows = document
            .querySelector(table)
            ?.querySelectorAll('div[class="grid-item"]');
          for (let j = 0; j < rows.length; j++) {
            const { innerText: name, href: url } = rows[j]
              .querySelector('h3[class="product-title"]')
              .getElementsByTagName("a")[0];
            const value = Number(
              rows[j]
                .querySelector('h4[class="product-price"]')
                .getElementsByTagName("span")[0]
                .innerText.replace("$", "")
                .replace(/,/g, "")
                .replace(/\n/g, "")
            );

            result.push({
              name,
              value,
              url,
              seller: { name: "Gamers Colombia", key: company },
            });
          }
          return result;
        },
        tableTarget,
        this.COMPANY_NAME
      );
      fullResult = fullResult.concat(data);
    }
    console.log(`${this.COMPANY_NAME} Success`);
    await browser.close();
    return fullResult;
  }
}
