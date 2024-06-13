const fs = require('fs');
const http = require('http');
const url = require('url');


////////////////////////////////////////
// FILES

// //reading content of file, takes filepath and character encoding param
// //Blocking, synchronous way
// const textIn = fs.readFileSync('./txt/input.txt', 'utf-8');

// console.log(textIn);

// const textOut = `This is what we know about the avocado: ${textIn}.\nCreated on ${Date.now()}`;

// //writing content to a file, takes filepath and content to add. function returns nothing
// fs.writeFileSync('./txt/output.txt', textOut);

// console.log("Files written!");


//Non-Blocking, asynchronous way
// fs.readFile('./txt/start.txt', 'utf-8', (err, data1) => {
//     if(err) return console.log("ERROR!");
//     fs.readFile(`./txt/${data1}.txt`, 'utf-8', (err, data2) => {
//         console.log(data2);
//         fs.readFile('./txt/append.txt', 'utf-8', (err, data3) => {
//             console.log(data3);
//             fs.writeFile('./txt/final.txt', `${data2}\n${data3}`, 'utf-8', err => {
//                 console.log("Your file has been written!");
//             })
//         });
//     })
// });
// console.log("Will read file!");


////////////////////////////////////////
// SERVER

//only executed once at startup, hence why synchronous is not an issue
//reading file
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
//takes json code and turns it into js object
const dataObj = JSON.parse(data);

//creating server, callback will be executed each time a new request hits server
const server = http.createServer((req, res) => {
    // ROUTING
    const pathName = req.url;

    if (pathName === '/' || pathName === '/overview') {
        res.end('This is the OVERVIEW');
    } else if (pathName === '/product') {
        res.end('This is the PRODUCT');
    } else if (pathName === '/api') {
            //telling browser we're sending json
            res.writeHead(200, {'Content-type': 'application/json'});
            //end needs to send back string
            res.end(data);
    } else {
        //sending a html header element to the browser
        res.writeHead(404, {
            'Content-type': 'text/html',
            'my-own-header': 'hello-world'
        });
        res.end('<h1>Page not found!</h1>');
    }
});

//listening for incoming requests on localhost:8000
server.listen(8000, '127.0.0.1', () => {
    console.log('Listening to requests on port 8000');
});
