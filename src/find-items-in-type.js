/**
 * 
 * @param { import('puppeteer').Browser } browser 
 * @param { string } itemType
 */
const findItemsInType = async (browser, baseURL, itemType) => {
  const page = await browser.newPage();
  await page.goto(baseURL + itemType, {
    timeout: 0,
  });

  const rowElements = await page.$$('tr.rd-filter__search-item');

  const itemDataPromises = [];
  rowElements.forEach(rowElement => {
    itemDataPromises.push(rowElement.evaluate(element => {
      const itemIDCell = element.children[2];
      const imageCell = element.children[0];
      const titleCell = element.children[1];

      const itemID = itemIDCell.getElementsByTagName('span')[0].innerText;
      const imageSrc = imageCell.children[0].children[0].getAttribute('href');
      const title = titleCell.children[0].innerHTML;

      return {
        itemID,
        title,
        imageSrc,
      };
    }));
  });
  const itemData = await Promise.all(itemDataPromises);

  console.log('Extracted data from page:', itemData.length);
  await page.close();
  return itemData;
};

/**
 * @param { HTMLElement } rowElement
 */
const extractRowInfo = (rowElement) => {
}

export default findItemsInType;