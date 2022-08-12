import findListOfTypes from './find-list-of-types.js';
import findItemsInType from './find-items-in-type.js';
import { launch } from 'puppeteer';

const baseURL = 'https://minecraftitemids.com';

const browser = await launch({
  headless: false,
  devtools: true,
  defaultViewport: {
    height: 600,
    width: 600,
  },
});

const itemTypes = await findListOfTypes(browser, baseURL);

const itemToTypeMap = {};
for (let i = 0; i < itemTypes.length; ++i) {
  const itemsInType = await findItemsInType(browser, baseURL, itemTypes[i]);
  Object.defineProperty(itemToTypeMap, itemTypes[i], itemsInType);
}

console.log('ALL DONE!');
