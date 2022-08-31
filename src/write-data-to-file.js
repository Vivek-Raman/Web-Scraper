import fs from 'fs';

const writeDataToFile = async (filePath, itemTypeMap) => {
  fs.writeFileSync(filePath, JSON.stringify(itemTypeMap, null, '  '));
}

export default writeDataToFile;
