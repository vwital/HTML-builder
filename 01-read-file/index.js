const path = require('path');
const fs = require('fs');
const { stdout } = process;

const pathToFile = path.join(__dirname, 'text.txt');
const readStream = fs.createReadStream(pathToFile, 'utf-8');

let data = '';
readStream.on('data', (chunk) => (data += chunk));
readStream.on('end', () => stdout.write(data));
readStream.on('error', (err) => console.log(err));
