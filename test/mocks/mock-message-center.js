(() => {
  'use strict';

  const EventEmitter = require('events');

  class MockMessageCenter extends EventEmitter {
    sendEvent(...data) {
      this.emit('sendEvent', ...data);
      this.emit(...data);
      return Promise.resolve();
    }
    addEventListener(event, metadata, listener) {
      this.emit('addEventListener', event, metadata, listener);
      this.addListener(event, listener);
      return Promise.resolve();
    }
    removeEventListener(event, listener) {
      this.emit('removeEventListener', event, listener);
      this.removeListener(event, listener);
      return Promise.resolve();
    }
  }

  module.exports = MockMessageCenter;
})();
