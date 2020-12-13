import { table } from "console";
import puppeteer from "puppeteer";

export class PuppeteerService {
  constructor() {}

  async getImage(name: string): Promise<string> {
    try {
      const firstImage =
        "#i9 > div.FAZ4xe.oQYlMd > span > div > div.Q2tIyd > div:nth-child(1) > c-wiz > div > a > div > div.T6b9se.eKtPwd > img";
      const browser = await puppeteer.launch();
      const wait = (ms: number) =>
        new Promise((resolve) => setTimeout(resolve, ms));

      const page = await browser.newPage();

      await page.setUserAgent(
        "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36"
      );

      await page.setViewport({ width: 1366, height: 768 });
      await page.goto("https://www.google.com/imghp?hl=EN");
      await page.focus('input[name="q"]');
      await page.keyboard.type(name);
      await page.keyboard.press("Enter");

      await page.waitForSelector(
        "#yDmH0d > div.T1diZc.KWE8qe > c-wiz > c-wiz > div > div > div > div.bMoG0d"
      );
      const data = await page.evaluate((firstImg: string) => {
        const imgBase: any = document
          .querySelector(
            "#yDmH0d > div.T1diZc.KWE8qe > c-wiz > c-wiz > div > div > div > div.bMoG0d"
          )
          ?.querySelectorAll("img")[0].src;
        return imgBase;
      }, firstImage);

      await browser.close();
      return data;
    } catch (error) {
        return '';
    }
    
  }
}
