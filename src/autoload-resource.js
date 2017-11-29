(() => {
  'use strict';

  class AutoloadResource {
    load(messageCenter) {
      return Promise.resolve()
        .then(() => {
          // TODO: Send resource add event
          // TODO: Add event lsitener for autoload queries
        });
    }

    unload() {
      return Promise.resolve()
        .then(() => {
          // TODO: Send resource remove event
        });
    }
  }

  module.exports = AutoloadResource;
})();
