const fs = require('fs');
const path = require('path');
const readline = require('readline');

const filePath = path.join(__dirname, 'output.txt');

const fileStream = fs.createWriteStream(filePath, { flags: 'a' });

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

console.log(
  'Welcome! Please enter text (type "exit" or use Ctrl+C to finish):',
);

const handleInput = (input) => {
  if (input.trim().toLowerCase() === 'exit') {
    console.log('Goodbye!');
    rl.close();
    fileStream.end();
  } else {
    fileStream.write(input + '\n');
    rl.prompt();
  }
};

rl.setPrompt('Enter text: ');
rl.prompt();

rl.on('line', handleInput);
rl.on('SIGINT', () => {
  console.log('\nGoodbye!');
  rl.close();
  fileStream.end();
});
