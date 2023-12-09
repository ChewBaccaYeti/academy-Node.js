const { readFile, writeFile, appendFile, readdir, lstat } =
    require('fs').promises;
const path = require('path');

const fileManipulationsExample = async () => {
    try {
        const fileDir = 'files';
        const pathToFile = path.join(fileDir, 'book.txt');
        const readResult = await readFile(pathToFile);
        console.log(readResult.toString());

        const listDirContents = await readdir(fileDir);
        const dirStat = await lstat(fileDir);
        console.log(listDirContents);
        console.log(dirStat);

        const pathToJson = path.join(fileDir, 'settings.json');
        const readJsonResult = await readFile(pathToJson);
        const json = JSON.parse(readJsonResult);

        json.name = 'Statham';

        await writeFile('newJson.json', JSON.stringify(json));
        console.log(json);
    } catch (err) {
        console.log(err);
    }
};
fileManipulationsExample();
