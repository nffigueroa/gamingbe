const puppeteer = require('puppeteer');

(async function () {

    const browser = await puppeteer.launch();

    const page = await browser.newPage();

    await page.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36');

    await page.setViewport({ width: 1366, height: 768 });

    await page.goto('https://localbitcoins.com/es/');
    const el = await page.$x('//*[@id="bs-example-navbar-collapse-1"]/ul[1]/li[2]/a');
    await el[0].click();
    await page.screenshot({ path: 'screenshot.png', fullPage: true });
    await browser.close();
})();