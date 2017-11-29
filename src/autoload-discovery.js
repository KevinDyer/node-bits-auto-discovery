(() => {
  'use strict';

  const EventEmitter = require('events');

  class AutoloadDiscovery extends EventEmitter {
    load(messageCenter) {
      return Promise.resolve()
        .then(() => {
          // TODO: Query for autoload resources
          // TODO: Add event listener for new autoload resources
        });
    }

    unload() {
      return Promise.resolve();
    }
  }

  module.exports = AutoloadDiscovery;
})();
