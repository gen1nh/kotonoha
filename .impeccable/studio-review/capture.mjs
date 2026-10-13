import fs from 'node:fs';
import {chromium} from '@playwright/test';
const browser=await chromium.launch();const context=await browser.newContext({serviceWorkers:'block'});const page=await context.newPage();
await page.emulateMedia({reducedMotion:'reduce'});await page.goto('http://127.0.0.1:5173');await page.waitForLoadState('networkidle');await page.evaluate(()=>document.fonts.ready);
for(const [device,width,height] of [['desktop',1440,1000],['mobile',390,844]]) {
 await page.setViewportSize({width,height});
 for(const view of ['home','learn','review','paper','jlpt','settings']) {
  if(view==='settings')await page.locator(device==='mobile'?'.mobile-settings':'.settings-link button').click();
  else await page.locator(`${device==='mobile'?'.bottom-nav':'.side-nav'} [data-view="${view}"]`).click();
  await page.evaluate(()=>window.scrollTo(0,0));
  await page.screenshot({path:`.impeccable/studio-review/${view}-${device}.png`,fullPage:true,animations:'disabled'});
  if(view==='home')await page.screenshot({path:`.impeccable/studio-review/home-${device}-viewport.png`,animations:'disabled'});
 }
}
await browser.close();
