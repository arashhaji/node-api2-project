const express = require('express');

const postsRouter = require('../Posts/postsRouter');

const server = express();

server.use(express.json());

server.get('/',(req, res) => {
   res
   .send(`<h1>Node Api Project #2</h1>`)
})

server.use('/api/Posts', postsRouter);

module.exports = server;