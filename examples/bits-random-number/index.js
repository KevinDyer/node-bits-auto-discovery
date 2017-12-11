(() => {
  'use strict';

  const {LocalResource} = require('../..');

  class ModuleApp {
    constructor() {
      this._resource = new LocalResource({topic: 'numbers', value: -1});
      this._interval = null;
    }

    load(messageCenter) {
      return Promise.resolve()
        .then(() => this._resource.load(messageCenter))
        .then(() => {
          this._interval = setInterval(() => {
            const num = this._getRandomInt();
            this._resource.setValue(num);
          }, 2000);
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

    _getRandomInt({min=0, max=100}={}) {
      return Math.floor(Math.random() * (max - min) + min);
    }
  }

  module.exports = new ModuleApp();
})();
