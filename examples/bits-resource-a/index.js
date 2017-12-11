(() => {
  'use strict';

  const {LocalResource} = require('../..');

  class ModuleApp {
    constructor() {
      this._resource = new LocalResource({
        topic: 'device/cpu/temperature',
        uuid: 'f90777d1-9021-47aa-82cc-a6dc747a6308',
        value: 64.2,
      });
      this._timeout = null;
    }

    load(messageCenter) {
      return Promise.resolve()
        .then(() => this._resource.load(messageCenter))
        .then(() => this._setResource());
    }

    _setResource() {
      const value = Math.floor(Math.random() * (55 - 5)) + 5;
      this._resource.setValue(value);
      const delay = Math.floor(Math.random() * (5000 - 500)) + 500;
      console.log(`delay=${delay}`);
      this._timeout = setTimeout(() => this._setResource(), delay);
    }

    unload() {
      return Promise.resolve()
        .then(() => {
          clearTimeout(this._timeout);
          this._timeout = null;
        })
        .then(() => this._resource.unload());
    }
  }

  module.exports = new ModuleApp();
})();
