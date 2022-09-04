import xlsx from "json-as-xlsx";

/**
 * @param { {string?: import("./types/Entry").Entry[]} } itemToTypeMap
 * @param { string } excelFile
 */
const convertToCSV = async (itemToTypeMap, excelFile) => {
  /**
   * @type { import("json-as-xlsx").IJsonSheet[] } workbookData
   */
  const workbookData = [];

  Object.entries(itemToTypeMap).forEach((entry) => {
    workbookData.push({
      sheet: entry[0].split('/')[2],
      columns: [
        {
          label: "title", 
          value: "title",
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
