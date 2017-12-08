(() => {
  'use strict';

  const {ResourceManager} = require('../..');

  class ModuleApp {
    constructor() {
      this._resourceManager = new ResourceManager({topic: 'simple'});
      this._resourceManager.on('add', (res) => {
        console.log(`ADD: ${res.getUuid()}`);
        res.on('value', (value) => {
          console.log(`VALUE[${res.getUuid()}]:`, value);
        });
      });
      this._resourceManager.on('remove', (res) => {
        console.log(`REMOVE: ${res.getUuid()}`);
      });
    }

    load(messageCenter) {
      return Promise.resolve()
        .then(() => this._resourceManager.load(messageCenter));
    }

    unload() {
      return Promise.resolve()
        .then(() => this._resourceManager.unload());
    }
  }

  module.exports = new ModuleApp();
})();
