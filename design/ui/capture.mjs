import {chromium} from '@playwright/test';
const b=await chromium.launch();const p=await b.newPage({viewport:{width:375,height:900}});await p.emulateMedia({reducedMotion:'reduce'});await p.goto('http://127.0.0.1:5173');
await p.screenshot({path:'design/ui/inicio-mobile.png',fullPage:true});
await p.locator('.bottom-nav [data-view="learn"]').click();await p.screenshot({path:'design/ui/aprender-mobile.png',fullPage:true});
await p.setViewportSize({width:1440,height:1000});await p.locator('.settings-link').click();await p.screenshot({path:'design/ui/preferencias-desktop.png',fullPage:true});await b.close();

