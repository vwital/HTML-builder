const path = require('path');
const fs = require('fs');
const fsPromises = fs.promises;

const sourceComponents = path.join(__dirname, 'components');
const sourceHtml = path.join(__dirname, 'template.html');
const sourceAssets = path.join(__dirname, 'assets');
const sourceStyles = path.join(__dirname, 'styles');
const targetFilesPath = path.join(__dirname, 'project-dist');
const targeAssets = path.join(targetFilesPath, 'assets');

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
    fs.rm(folderPath, { recursive: true, force: true }, (err) => {
      if (err) {
        console.log('Error deleting folder: ', err);
        reject();
      }
      resolve();
    });
  });
}

async function copyDir(from, to) {
  return new Promise((resolve, reject) => {
    fs.readdir(from, { withFileTypes: true }, (err, files) => {
      if (err) {
        console.log('Readdir err', err);
      }
      files.forEach((file) => {
        if (file.isDirectory()) {
          fsPromises.mkdir(
            path.join(to, file.name),
            { recursive: true },
            (err) => {
              if (err) console.log('Folder', err);
            },
            resolve(),
          );

          copyDir(path.join(from, file.name), path.join(to, file.name));
        } else {
          fs.readFile(path.join(file.path, file.name), (err, data) => {
            if (err) {
              console.log('Read Err', err);
              reject();
            }
            fsPromises.mkdir(
              path.dirname(path.join(to, file.name)),
              { recursive: true },
              (err) => {
                if (err) console.log('MKDIR ERR');
              },
            );
            fsPromises.writeFile(path.join(to, file.name), data, (err) => {
              if (err) console.log('COPY ERR', err);
            });
          });
        }
      });
      resolve();
    });
  });
}
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

async function creareHtmlMarkup() {
  return new Promise((resolve, reject) => {
    const targetFile = path.join(targetFilesPath, 'index.html');
    const output = fs.createWriteStream(targetFile);
    let templateData = '';
    fs.readFile(sourceHtml, 'utf-8', (err, data) => {
      if (err) {
        console.log(err);
        reject();
      }
      templateData = data;
    });
    fs.readdir(sourceComponents, (err, files) => {
      if (err) console.log(err);
      let usedFiles = 0;
      files.forEach((file) => {
        const currentComponent = path.basename(
          file.slice(0, file.lastIndexOf('.')),
        );
        fs.readFile(path.join(sourceComponents, file), 'utf-8', (err, data) => {
          if (err) {
            console.log(err);
            reject();
          }
          templateData = templateData.replace(`{{${currentComponent}}}`, data);
          usedFiles += 1;
          if (usedFiles === files.length) {
            output.write(templateData, (err) => {
              if (err) {
                console.log(err);
              }
              resolve();
            });
          }
        });
      });
    });
  });
}
async function buildPage() {
  fs.access(targeAssets, (err) => {
    if (err) {
      createDirectory(targetFilesPath);
      asyncFunc();
    } else {
      asyncFunc();
    }
  });
  async function asyncFunc() {
    await removeFolder(targeAssets);
    createDirectory(targetFilesPath);
    await copyDir(sourceAssets, targeAssets);
    await createStylesBunle();
    await creareHtmlMarkup();
  }

  console.log('Build completed');
}

buildPage();
