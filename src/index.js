import findListOfTypes from './find-list-of-types.js';
import { launch } from 'puppeteer';

const browser = await launch({
  headless: false,
  devtools: true,
  defaultViewport: {
    height: 600,
    width: 600,
  },
});

const itemTypes = await findListOfTypes(browser);


console.log('ALL DONE!');
