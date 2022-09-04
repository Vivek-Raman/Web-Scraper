import fetch from "node-fetch";

/**
 * 
 * @param { import('puppeteer').Browser } browser 
 * @param { string } baseURL
 * @param { string } itemType
 */
const findItemsInType = async (browser, baseURL, itemType) => {
  console.log('Start extracting data from type', itemType);
  const itemData = [];
  let pageNumber = 1;
  try {
    const page = await browser.newPage();
    do {
      const url = baseURL + itemType + getPagePath(pageNumber);

      const shouldGotoNextPage = await fetch(url, {redirect:'manual'})
          .then(res => res.status !== 301);
      if (!shouldGotoNextPage) return itemData;

      console.log('Extracting data from page', itemType + getPagePath(pageNumber));
      await page.goto(url, {
        timeout: 0,
        waitUntil: 'domcontentloaded',
      });

      const rowElements = await page.$$('tr.rd-filter__search-item');
      const itemDataPromises = [];
      rowElements.forEach(rowElement => {
        itemDataPromises.push(rowElement.evaluate(element => {
          const itemIDCell = element.children[2];
          const titleCell = element.children[1];
          const imageCell = element.children[0];

          const itemID = itemIDCell.getElementsByTagName('span')[0].innerText.trim();
          const title = titleCell.children[0].innerHTML.trim();

          let imageSrc = '';
          if (imageCell?.hasChildNodes()) {
            imageSrc = imageCell.children[0].children[0].getAttribute('src')?.trim();
          }
          return {
            itemID,
            title,
            imageSrc,
          };
        }).catch(async (e) => {
          return await rowElement.evaluate((element) => {
            const itemIDCell = element.children[2];
            const titleCell = element.children[1];

            const itemID = itemIDCell.getElementsByTagName('span')[0].innerText.trim();
            const title = titleCell.children[0].innerHTML.trim();
            const imageSrc = '';

            return {
              itemID,
              title,
              imageSrc,
            };
          });
        }).catch(async (e) => {
          console.error('Error in', url, 'rowElement',
              await rowElement.evaluate(element => element.outerHTML), ':', e);
          return {
            itemID: '',
            title: '',
            imageSrc: '',
          }
        }));
      });
      const pageData = await Promise.all(itemDataPromises);
      itemData.push(...pageData.filter(item => item !== null));

      console.log('Extracted data from page', itemType + getPagePath(pageNumber), ':', pageData.length);
      rowElements.forEach(async (res) => { await res.dispose() });

      pageNumber++;
    } while (pageNumber < 10);

    await page.close();
    return itemData.filter(item => item !== null);
  } catch (err) {
    console.error('Error fetching data from page', itemType + getPagePath(pageNumber), 'error: ', err);
  }
  return;
};

const getPagePath = (pageNumber) => {
  if (pageNumber === 1) {
    return '';
  } else if (pageNumber > 1) {
    return '/' + pageNumber;
  }
}

export default findItemsInType;
