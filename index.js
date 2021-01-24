'use strict';

require('dotenv').config();
const logger = require('./includes/logger');

// the webserver
const express = require('express'),
      routes = express(),
      server = require('http').Server(routes);

routes.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');  // http server test
});

server.listen(process.env.PORT, () => {
  logger.info('starting webserver on port ' + process.env.PORT);
});

// discord client
const client = require('./includes/client');
client.start();
