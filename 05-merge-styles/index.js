const path = require('path');
const fs = require('fs');

const stylesFolderPath = path.join(__dirname, 'styles');
const finalFolderPath = path.join(__dirname, 'project-dist');
const bundlePath = path.join(finalFolderPath, 'bundle.css');
const output = fs.createWriteStream(bundlePath);

fs.readdir(stylesFolderPath, { withFileTypes: true }, (err, files) => {
  if (err) console.log('Error with style folder', err);
  const onlyCSSFiles = files.filter(
    (file) => path.extname(file.name) === '.css' && !file.isDirectory(),
  );

  onlyCSSFiles.forEach((file) => {
    fs.readFile(path.join(file.path, file.name), 'utf-8', (err, data) => {
      if (err) console.log('Error reading style file', err);
      output.write(data, (err) => {
        if (err) console.log('Error writing data', err);
      });
    });
  });
});
