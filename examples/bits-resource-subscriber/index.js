(() => {
  'use strict';

  const {ResourceManager} = require('../..');

  class ModuleApp {
    constructor() {
      this._numbersResources = new ResourceManager({topic: 'numbers'});
      this._numbersResources.on('add', (res) => {
        console.log(`New 'numbers' resource: ${res.getUuid()}`);
        res.on('value', (value) => {
          console.log(`Resource ${res.getUuid()} changed value:`, value);
        });
      });
    }

    load(messageCenter) {
      return this._numbersResources.load(messageCenter);
    }

    unload() {
      return this._numbersResources.unload();
    }
  }

  module.exports = new ModuleApp();
})();
