(() => {
  'use strict';

  const UUID = '191f092b-065a-4e8e-b275-f5fa4195ecd5';

  const {LocalResource} = require('../..');

  class ModuleApp {
    constructor() {
      this._resource = new LocalResource({
        topic: 'simple',
        uuid: UUID,
        value: 42,
      });
      this._interval = null;
    }

    load(messageCenter) {
      return Promise.resolve()
        .then(() => this._resource.load(messageCenter))
        .then(() => {
          this._interval = setInterval(() => {
            const value = Math.floor(Math.random() * (100 - 50)) + 50;
            this._resource.setValue(value);
          }, 1000);
        });
    }

    unload() {
      return Promise.resolve()
        .then(() => {
          clearInterval(this._interval);
          this._interval = null;
        })
        .then(() => this._resource.unload());
    }
  }

  module.exports = new ModuleApp();
})();
