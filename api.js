#!/usr/bin/env node
const Server = require('@ladjs/api');
const mongoose = require('@ladjs/mongoose');
const Graceful = require('@ladjs/graceful');
const maxListenersExceededWarning = require('max-listeners-exceeded-warning');

const config = require('./config');
const routes = require('./routes');
const { i18n, logger } = require('./helpers');
const { Users } = require('./app/models');

if (process.env.NODE_ENV !== 'production') maxListenersExceededWarning();

const server = new Server({
  Users,
  routes: routes.api,
  logger,
  i18n
});

if (!module.parent) {
  mongoose.configure({
    ...config.mongoose,
    logger
  });

  mongoose
    .connect()
    .then(() => {
      server.listen(process.env.API_PORT);
    })
    .catch(logger.error);

  const graceful = new Graceful({ mongoose, server, logger });
  graceful.listen();
}

module.exports = server;
