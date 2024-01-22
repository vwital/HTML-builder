const path = require('path');
const fs = require('fs');

const folderPath = path.join(__dirname, 'files');
const newFolderPath = path.join(__dirname, 'files-copy');

async function copyDir() {
  await removeDir();
  fs.mkdir(newFolderPath, { recursive: true }, (err) => {
    if (err) console.log('Error creating folder: ', err);
  });
  await copyFile();
  console.log('Folder copied');
}
//Remove old folder if it exist
async function removeDir() {
  return new Promise((resolve, reject) => {
    fs.rm(newFolderPath, { recursive: true, force: true }, (err) => {
      if (err) {
        console.log('Delete err: ', err);
        reject();
      }
      resolve();
    });
  });
}
//Copy new files
async function copyFile() {
  return new Promise((resolve, reject) => {
    fs.readdir(folderPath, (err, files) => {
      if (err) {
        console.log('Error reading original files', err);
        reject();
      }

      files.forEach((file) => {
        fs.copyFile(
          path.join(folderPath, file),
          path.join(newFolderPath, file),
          (err) => {
            if (err) console.log('Copy error: ', err);
          },
        );
      });
      resolve();
    });
  });
}
copyDir();
