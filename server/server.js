const express = require('express');
const server = express();
const path = require('path');

// server.use('') //bodyParser
//server.use() bodyParser encoding options
// server.use() //cookieParser

server.use('/', express.static(path.resolve(__dirname, '../src')));

server.get('/', express.static(path.resolve(__dirname, '../src')));

server.listen(3000, console.log('Server listening on port 3000'));