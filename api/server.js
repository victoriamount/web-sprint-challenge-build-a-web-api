const express = require('express');
const server = express();
const actionsRouter = require('./actions/actions-router')
const projectsRouter = require('./projects/projects-router')


// Complete your server here!
// Do NOT `server.listen()` inside this file!


server.use(express.json())
server.use('/api/actions', logger, actionsRouter)
server.use('/api/projects', logger, projectsRouter)

server.get('/', logger, (req, res) => {
    res.send(`<h2>Hi! Inside '/'</h2>`)
})



function logger(req, res, next) {
    console.log('Req method: ', req.method)
    console.log('Req url: ', req.url)
    console.log('Timestamp: ', new Date())
  
    next()
  }

module.exports = server;
