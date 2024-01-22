const path = require('path');
const fs = require('fs');
const fsPromises = fs.promises;

const sourceFilesPath = path.join(__dirname);
const sourceComponents = path.join(__dirname, 'components');
const sourceHtml = path.join(__dirname, 'template.html');
const sourceAssets = path.join(__dirname, 'assets');
const sourceStyles = path.join(__dirname, 'styles');
const targetFilesPath = path.join(__dirname, 'project-dist');
const targeAssets = path.join(targetFilesPath, 'assets');
const targetHtml = path.join(targetFilesPath, 'index.html');

async function createDirectory(folderPath) {
  return new Promise((resolve, reject) => {
    fsPromises.mkdir(folderPath, { recursive: true }, (err) => {
      if (err) {
        console.log('Error creating folder: ', err);
        reject();
      }
      console.log('Folder created');
      resolve();
    });
  });
}

async function removeFolder(folderPath) {
  return new Promise((resolve, reject) => {
    fs.rm(folderPath, { recursive: true }, (err) => {
      if (err) {
        console.log('Error deleting folder: ', err);
        reject();
      }
      console.log('Folder removed');
      resolve();
    });
  });
}

async function copyDir(from, to) {
  await removeFolder(to);
  await createDirectory(to);
  fs.copyFile(from, to, (err) => {
    if (err) {
      console.log('Copy error: ', err);
    }
    console.log('Copy compleated');
  });
}

createDirectory(targetFilesPath);

// Create styles Bundle

async function createStylesBunle() {
  return new Promise((resolve, reject) => {
    const targetFile = path.join(targetFilesPath, 'style.css');
    const output = fs.createWriteStream(targetFile);
    fs.readdir(sourceStyles, (err, files) => {
      files.forEach((file) => {
        fs.readFile(path.join(sourceStyles, file), 'utf-8', (err, data) => {
          if (err) {
            console.log('Error creating bundle: ', err);
            reject();
          }
          output.write(data);
          resolve();
        });
      });
    });
  });
}
createStylesBunle();
copyDir(sourceAssets, targeAssets);

async function creareHtmlMarkup() {
  return new Promise((resolve, reject) => {
    const targetFile = path.join(targetFilesPath, 'index.html');
    const output = fs.createWriteStream(targetFile);
    let templateData = '';
    fs.readFile(sourceHtml, 'utf-8', (err, data) => {
      templateData = data;
    });
    fs.readdir(sourceComponents, (err, files) => {
      if (err) console.log(err);
      files.forEach((file, idx) => {
        const currentComponent = path.basename(
          file.slice(0, file.lastIndexOf('.')),
        );
        fs.readFile(path.join(sourceComponents, file), 'utf-8', (err, data) => {
          templateData = templateData.replace(`{{${currentComponent}}}`, data);
          if (err) console.log(err);
          if (idx === files.length - 1) {
            output.write(templateData, (err) => {
              if (err) {
                console.log(err);
                reject();
              }
              resolve();
            });
          }
        });
      });
    });
  });
}

creareHtmlMarkup();
