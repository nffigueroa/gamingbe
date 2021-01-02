import { IProducts } from "../interfaces/Products";
import puppeteer from "puppeteer";
import { ItemProduct } from "../interfaces/ItemProduct";

export class TiendaGamerMedellin implements IProducts {
  private URL =
    "https://www.tiendagamermedellin.co/search?q=&authenticity_token=XJGSMVLy15Uxei%2F8gOwDCs7sbbTd2iClh5IAXDD14uI%3D";
  private COMPANY_NAME = "tiendagamermedellin";
  page: any;
  browser: any;
  result: any;
  constructor() {}

  async getTable(): Promise<Array<ItemProduct>> {
    const response: any = await this.connect(
      this.URL,
      "body > div.container.page-content.results-search > div:nth-child(2) > div > div"
    );
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
    const pagesNumber = await page.evaluate(
      () =>
        (<HTMLElement>(
          document.querySelector(
            "body > div.container.page-content.results-search > div.row.mb-4 > div.col-6.product-gallery-amount > span > strong"
          )
        )).innerText.split(" ")[0]
    );
    const totalPages = Math.round(Number(pagesNumber) / 24);
    let fullResult: {
      name: any;
      value: any;
      url: any;
      seller: { name: string; key: any };
    }[] = [];

    let data;
    for (let j = 0; j < totalPages; j++) {
      data = await page.evaluate(
        (table, company) => {
          let result = [];
          const rows = document
            .querySelector(table)
            ?.querySelectorAll('div[class="col-lg-4 col-6 product-block"]');
          for (let i = 0; i < rows.length; i++) {
            const { innerText: name, href: url } = rows[i]
              .querySelector('h3[class="product-name"]')
              .querySelector("a");
            const value = Number(
              rows[i]
                .querySelector('div[class="price-mob"]')
                .innerText.split("Antes")[0]
                .replace("$", "")
                .replace("COP", "")
                .replace(/\./g, "")
                .replace(/\n/g, "")
            );
            result.push({
              name,
              value,
              url,
              seller: { name: "Tienda Gamer Medellin", key: company },
            });
          }
          return result;
        },
        tableTarget,
        this.COMPANY_NAME
      );
      if (j !== totalPages - 1) {
        await Promise.all([
          page.click(
            "body > div.container.page-content.results-search > div:nth-child(2) > div > div > div.col-12.product-gallery-pager > nav > ul > li.next.jump.page-item > a"
          ),
          page.waitForNavigation({ waitUntil: "networkidle2" }),
        ]);
      }

      await page.screenshot({ path: "gamermedellin.png", fullPage: true });
      fullResult = fullResult.concat(data);
    }
    console.log(`${this.COMPANY_NAME} Success`);
    await browser.close();
    return fullResult;
  }
}
