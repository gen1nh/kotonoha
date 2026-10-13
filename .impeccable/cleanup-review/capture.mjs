import {chromium} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
const browser=await chromium.launch();const context=await browser.newContext({serviceWorkers:'block'});const page=await context.newPage();
page.on('pageerror',e=>console.log('ERROR',e.message));
await page.goto('http://127.0.0.1:5173');
for(const [name,width,height] of [['desktop',1440,1000],['mobile',390,844]]){
 await page.setViewportSize({width,height});
 for(const view of ['home','learn','jlpt','review','paper','settings','chat']){
  if(view==='chat'&&name==='mobile')continue;
  await page.locator(`[data-view="${view}"]:visible`).first().click();
  await page.evaluate(()=>document.fonts.ready);
  await page.screenshot({path:`.impeccable/cleanup-review/${view}-${name}.png`,fullPage:true,animations:'disabled'});
  const audit=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
  console.log(name,view,'overflow',await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),'a11y',JSON.stringify(audit.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary})).slice(0,4)}))));
 }
}
await page.setViewportSize({width:1440,height:1000});await page.locator('[data-view="learn"]:visible').first().click();
console.log('LEARN BUTTONS',await page.getByRole('button').allTextContents());
await page.locator('[data-view="paper"]:visible').first().click();console.log('NOTE BUTTONS',await page.getByRole('button').allTextContents());
await browser.close();

