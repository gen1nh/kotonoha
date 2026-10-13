import { chromium } from '@playwright/test';
const browser=await chromium.launch();
const page=await browser.newPage({viewport:{width:1366,height:900}});
await page.goto('http://127.0.0.1:5173/');
await page.locator('.brand-logo').first().waitFor();
await page.screenshot({path:'design/logo/kit/app-desktop.png'});
await page.setViewportSize({width:390,height:844});
await page.screenshot({path:'design/logo/kit/app-mobile.png'});
await browser.close();
