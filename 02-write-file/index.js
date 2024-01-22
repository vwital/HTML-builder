const { stdin, stdout } = process;
const path = require('path');
const fs = require('fs');

stdout.write('Hello! Enter text to the file: 02-write-file.txt\n');
const filePath = path.join(path.parse(__dirname).dir, '02-write-file.txt');
const output = fs.createWriteStream(filePath);
function exitApp() {
  stdout.write('Bye! Your file is in the root directory of the repo');
  process.exit();
}
process.on('SIGINT', exitApp);

stdin.on('data', (data) => {
  const stringData = data.toString();
  if (stringData.trim() === 'exit') {
    exitApp();
  }
  output.write(data);
  stdout.write(
    'Data recorded, enter more data or end process (ctrl + c or "exit" command)\n',
  );
});
