const path = require('path');
const fs = require('fs');
const folderPath = path.join(__dirname, 'secret-folder');

fs.readdir(folderPath, { withFileTypes: true }, (err, files) => {
  if (err) console.log('Error with reading directory', err);
  const onlyFiles = files.filter((file) => !file.isDirectory());
  onlyFiles.forEach((file) => {
    const filePath = path.join(file.path, file.name);
    const fileName = path
      .basename(filePath)
      .slice(0, path.basename(filePath).lastIndexOf('.'));
    const fileExt = path
      .extname(filePath)
      .slice(
        path.extname(filePath).indexOf('.') + 1,
        path.extname(filePath).length,
      );
    fs.stat(filePath, (err, stats) => {
      if (err) console.log('Error with stats: ', err);
      const fileSizeInKb = `${stats.size / 1024}kb`;
      console.log(`${fileName} - ${fileExt} - ${fileSizeInKb}`);
    });
  });
});
