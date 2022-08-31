/**
 * 
 * @param { import('puppeteer').Browser } browser 
 * @param { string } itemType
 */
const findItemsInType = async (browser, baseURL, itemType, itemTypeBlacklist) => {
  if (itemTypeBlacklist.indexOf(itemType) >= 0) {
    console.log('Skipping itemType', itemType);
    return;
  }

  console.log('Start extracting data from page', itemType);
  try {
    const page = await browser.newPage();
    do {
      let pageNumber = 1;
      const url = baseURL + itemType + getPagePath(pageNumber);
      
      const shouldGotoNextPage = await fetch(url, {redirect:'manual'})
          .then(res => res.status !== 301);
      if (!shouldGotoNextPage) return;

      await page.goto(url, {
        timeout: 0,
        // TODO: waitUntil?
      });

      const rowElements = await page.$$('tr.rd-filter__search-item');
      const itemDataPromises = [];
      rowElements.forEach(rowElement => {
        itemDataPromises.push(rowElement.evaluate(element => {
          const itemIDCell = element.children[2];
          const titleCell = element.children[1];
          const imageCell = element.children[0];

          const itemID = itemIDCell.getElementsByTagName('span')[0].innerText;
          const title = titleCell.children[0].innerHTML;
          const imageSrc = imageCell.children[0].children[0].getAttribute('href');
          return {
            itemID,
            title,
            imageSrc,
          };
        }));
      });
      const itemData = await Promise.allSettled(itemDataPromises);

      console.log('Extracted data from type', itemType + '/' + pageNumber, ':', itemData.length);
      rowElements.forEach(re => re.dispose());

    } while (0);

    await page.close();
    return itemData;
  } catch (err) {
    console.error('Error fetching data from page', itemType, 'error: ', err);
  }
  return;
};

const getPagePath = (pageNumber) => {
  if (pageNumber === 1) {
    return '';
  } else if (pageNumber > 1) {
    return '/' + Number.toString(pageNumber);
  }
}

export default findItemsInType;
