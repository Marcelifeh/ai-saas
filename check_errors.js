const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();

    page.on('console', msg => console.log('PAGE LOG:', msg.text()));
    page.on('pageerror', error => console.error('PAGE ERROR:', error.message));
    page.on('requestfailed', request =>
        console.error('REQUEST FAILED:', request.url(), request.failure().errorText)
    );

    await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });

    // Check if the root element has children
    const rootHtml = await page.evaluate(() => {
        const root = document.getElementById('root');
        return root ? root.innerHTML.substring(0, 100) : 'NO ROOT ELEMENT';
    });
    console.log('Root HTML snippet:', rootHtml);

    await browser.close();
})();
