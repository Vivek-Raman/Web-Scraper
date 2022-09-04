import findListOfTypes from './find-list-of-types.js';
import findItemsInType from './find-items-in-type.js';
import writeDataToFile from './write-data-to-file.js';
import convertToCSV from './convert-to-csv.js';
import { launch } from 'puppeteer';
import { resolve } from 'path';

const baseURL = 'https://minecraftitemids.com';
const filePath = resolve('./out/data.json');
const excelFile = resolve('./out/as-excel');

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

/**
 * @type { {string?: import("./types/Entry").Entry[]} }
 */
const itemToTypeMap = {};
for (let i = 0; i < itemTypes.length; ++i) {
  const itemsInType = await findItemsInType(browser, baseURL, itemTypes[i]);
  if (itemsInType !== undefined) {
    itemToTypeMap[itemTypes[i]] = itemsInType;
  }
}

await writeDataToFile(filePath, itemToTypeMap);

await convertToCSV(baseURL, itemToTypeMap, excelFile);

console.log('ALL DONE!');
browser.close();
