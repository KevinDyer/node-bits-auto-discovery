(() => {
  'use strict';

  const EventEmitter = require('events');

  class RemoteResource extends EventEmitter {
    constructor() {
      super();
    }

    load(messageCenter) {
    }

    unload() {
    }

    getValue() {
    }
  }

  module.exports = RemoteResource;
})();
