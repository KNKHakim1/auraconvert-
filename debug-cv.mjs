import puppeteer from 'puppeteer';

async function main() {
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage();
  
  await page.goto('http://localhost:3000/tools/watermark-remover', { waitUntil: 'networkidle0' });
  
  const debug = await page.evaluate(() => {
    return {
      hasCv: !!window.cv,
      cvKeys: window.cv ? Object.keys(window.cv).slice(0, 10) : [],
      hasMat: window.cv ? !!window.cv.Mat : false,
      type: typeof window.cv,
      str: window.cv ? String(window.cv).substring(0, 50) : 'none'
    };
  });
  
  console.log(debug);
  await browser.close();
}
main();
