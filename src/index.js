import findListOfTypes from './find-list-of-types.js';
import findItemsInType from './find-items-in-type.js';
import { launch } from 'puppeteer';
import writeDataToFile from './write-data-to-file.js';
import path from 'path';

const baseURL = 'https://minecraftitemids.com';
const itemTypeBlacklist = ['/types/spawn-egg', '/types/spawner',];
const filePath = path.resolve('./out/data.json');

const browser = await launch({
  headless: true,
  devtools: true,
  args: ['--ignore-certificate-errors',
  '--disable-gpu',
  '--no-sandbox',
  '--disable-setuid-sandbox',
  '--disable-dev-shm-usage',
  '--single-process',
  '--disable-accelerated-2d-canvas']
});

const itemTypes = await findListOfTypes(browser, baseURL);

const itemToTypeMap = {};
for (let i = 0; i < itemTypes.length; ++i) {
  const itemsInType = await findItemsInType(browser, baseURL, itemTypes[i], itemTypeBlacklist);
  if (itemsInType !== undefined) {
    itemToTypeMap[itemTypes[i]] = itemsInType;
  }
}

await writeDataToFile(filePath, itemToTypeMap);

console.log('ALL DONE!');
browser.close();
