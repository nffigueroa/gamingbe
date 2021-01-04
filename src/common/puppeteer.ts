import puppeteer from "puppeteer";

export class PuppeteerService {
  private attempts = 0;
  constructor() {}

  async getImage(name: string): Promise<string> {
    try {
      const firstImage =
        "#i9 > div.FAZ4xe.oQYlMd > span > div > div.Q2tIyd > div:nth-child(1) > c-wiz > div > a > div > div.T6b9se.eKtPwd > img";
      const browser = await puppeteer.launch();

      const page = await browser.newPage();

      await page.setUserAgent(
        "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36"
      );

      //await page.setViewport({ width: 1366, height: 768 });
      await page.goto("https://www.google.com/imghp?hl=EN");
      await page.focus('input[name="q"]');
      await page.keyboard.type(name);
      await page.keyboard.press("Enter");

      await page.waitForSelector(
        "#islrg > div.islrc > div:nth-child(1) > a.wXeWr.islib.nfEiy.mM5pbd > div.bRMDJf.islir > img"
      );
      let data = await page.evaluate((firstImg: string) => {
        const imgBase: any = (<HTMLImageElement>(
          document.querySelector(
            "#islrg > div.islrc > div:nth-child(1) > a.wXeWr.islib.nfEiy.mM5pbd > div.bRMDJf.islir > img"
          )
        ))?.src;
        return imgBase;
      }, firstImage);
      if (
        (data.length < 200 && this.attempts < 4) ||
        (this.attempts < 4 && data.includes("/////"))
      ) {
        this.attempts++;
        console.log(name, "Image Failed");
        data = this.getImage(name);
      }
      await browser.close();
      return data;
    } catch (error) {
      console.log(error);
      return "";
    }
  }
}
