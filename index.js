const fs = require('fs');

//reading content of file, takes filepath and character encoding param
const textIn = fs.readFileSync('./txt/input.txt', 'utf-8');

console.log(textIn);

const textOut = `This is what we know about the avocado: ${textIn}.\nCreated on ${Date.now()}`;

//writing content to a file, takes filepath and content to add. function returns nothing
fs.writeFileSync('./txt/output.txt', textOut);

console.log("Files written!");