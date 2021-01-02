import { IProducts } from "../interfaces/Products";
import puppeteer from "puppeteer";
import { ItemProduct } from "../interfaces/ItemProduct";
export class ClonesYPerifericos implements IProducts {
  private URL = "https://clonesyperifericos.com/tienda/";
  private COMPANY_NAME = "clonesyperifericos";
  constructor() {}

  async getTable(): Promise<Array<ItemProduct>> {
    const response: any = await this.connect(
      this.URL,
      "body > div.template-container > div.template-content > div.page-wrapper > div.container.sidebar-mobile-bottom.content-page.products-hover-only-icons > div > div > div.content.main-products-loop.col-md-9.col-md-push-3 > div.row.products-loop.products-grid.row-count-4",
      ""
    );
    return response;
  }

  async connect(url: string, tableTarget: string, tr: string) {
    const elementToDissapear =
      "body > div.template-container > div.template-content > div.page-wrapper > div.container.sidebar-mobile-bottom.content-page.products-hover-only-icons > div > div > div.content.main-products-loop.col-md-9.col-md-push-3 > div.after-shop-loop > nav > ul > li:nth-child(1) > span";
    const browser = await puppeteer.launch();

    const page = await browser.newPage();

    await page.setUserAgent(
      "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36"
    );

    await page.goto(url, { waitUntil: "domcontentloaded" });
    await page.setViewport({ width: 1366, height: 768 });

    await page.select(
      "body > div.template-container > div.template-content > div.page-wrapper > div.container.sidebar-mobile-bottom.content-page.products-hover-only-icons > div > div > div.content.main-products-loop.col-md-9.col-md-push-3 > div.filter-wrap > div > div.products-per-page.et-hidden-phone > form > select",
      "-1"
    );
    await page.$eval(
      "body > div.template-container > div.template-content > div.page-wrapper > div.container.sidebar-mobile-bottom.content-page.products-hover-only-icons > div > div > div.content.main-products-loop.col-md-9.col-md-push-3 > div.filter-wrap > div > div.products-per-page.et-hidden-phone > form",
      (form: any) => form.submit()
    );

    await page.waitForSelector(elementToDissapear, { hidden: true });
    const wait = (ms: number) =>
      new Promise((resolve) => setTimeout(resolve, ms));
    await wait(2000);
    const data = await page.evaluate(
      (table: string, company: string) => {
        const rows: any = document.querySelector(table)?.children;

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
      },
      tableTarget,
      this.COMPANY_NAME
    );
    console.log(`${this.COMPANY_NAME} Success`);
    await browser.close();
    return data;
  }
}
