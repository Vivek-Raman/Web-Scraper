import xlsx from "json-as-xlsx";

/**
 * @param { string } baseURL
 * @param { {string?: import("./types/Entry").Entry[]} } itemToTypeMap
 * @param { string } excelFile
 */
const convertToCSV = async (baseURL, itemToTypeMap, excelFile) => {
  /**
   * @type { import("json-as-xlsx").IJsonSheet[] } workbookData
   */
  const workbookData = [];

  Object.entries(itemToTypeMap).forEach((entry) => {
    workbookData.push({
      sheet: entry[0].split('/')[2],
      columns: [
        {
          label: "Item Name", 
          value: "title",
        },
        {
          label: "Item ID",
          value: "itemID",
        },
        {
          label: "Image URL", 
          /**
           * @param { import("./types/Entry").Entry } item 
           * @returns { string }
           */
          value: item => {
            if (item.imageSrc === '') {
              return '';
            } else {
              return baseURL.concat(item.imageSrc);
            }
          },
        }
      ],
      content: entry[1],
    })
  });

  xlsx(workbookData, {
    "fileName": excelFile,
    extraLength: 3,
  });
}

export default convertToCSV;
