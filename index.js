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


const replaceTemplate = (temp, product) => {
    let output = temp.replace(/{%PRODUCTNAME%}/g, product.productName);
    output = output.replace(/{%IMAGE%}/g, product.image);
    output = output.replace(/{%PRICE%}/g, product.price);
    output = output.replace(/{%FROM%}/g, product.from);
    output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
    output = output.replace(/{%QUANTITY%}/g, product.quantity);
    output = output.replace(/{%DESCRIPTION%}/g, product.description);
    output = output.replace(/{%ID%}/g, product.id);

    if(!product.organic){
        output = output.replace(/{%NOT_ORGANIC%}/g, 'not-organic');
    }
    return output;
}

//only executed once at startup, hence why synchronous is not an issue
//reading file
const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8');
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8');
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8');

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');

//takes json code and turns it into js object
const dataObj = JSON.parse(data);

//creating server, callback will be executed each time a new request hits server
const server = http.createServer((req, res) => {
    // ROUTING

    const {query, pathname} = url.parse(req.url, true);

    // OVERVIEW PAGE
    if (pathname === '/' || pathname === '/overview') {
        res.writeHead(200, {'Content-type': 'text/html'});
        //looping over products in dataObj, replacing placeholder in template-card with current product
        //.join() joins all elements of array into a string
        const cardsHtml = dataObj.map(el =>replaceTemplate(tempCard, el)).join('');

        const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);
        res.end(output);

    // PRODUCT PAGE
    } else if (pathname === '/product') {
        res.writeHead(200, {'Content-type': 'text/html'});
        const product = dataObj[query.id];
        const output = replaceTemplate(tempProduct, product);
        res.end(output);

    // API
    } else if (pathname === '/api') {
            //telling browser we're sending json
            res.writeHead(200, {'Content-type': 'application/json'});
            //end needs to send back string
            res.end(data);

    // NOT FOUND
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
