/**
 * @param { import('puppeteer').Browser } browser
 * @param { string } baseURL
 * @returns { Promise<string[]> }
 */
const findListOfTypes = async (browser, baseURL) => {
  const url = baseURL + '/types';

  const page = (await browser.pages())[0];
  await page.goto(url, {
    timeout: 0,
  });

  console.log('Navigated to', url);

  const linkElements = await page.$$('div.card-body > .btn.btn-mcid.btn-block');

  const promises = [];
  linkElements.forEach(button => {
    promises.push(button.evaluate((btn) => btn.getAttribute('href')));
  });

  const links = await Promise.all(promises);
  console.log('Obtained type links:', links);
  return links;
};

export default findListOfTypes;