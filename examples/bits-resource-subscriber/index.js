(() => {
  'use strict';

  const {ResourceManager} = require('../..');

  class ModuleApp {
    constructor() {
      this._cpuTemp = new ResourceManager({topic: 'device/cpu/temperature'});
      this._cpuTemp.on('add', (res) => {
        console.log(`ADD: ${res.getUuid()}`);
        res.on('value', (value) => console.log(`VALUE[${res.getUuid()}]:`, value));
      });
      this._allTemps = new ResourceManager({topic: new RegExp('[\\w]emperature')});
      // this._allTemps = new ResourceManager({topic: new RegExp('device/[\\w\\d]+/temperature')});
      this._allTemps.on('add', (res) => {
        console.log(`All Temps: ${res.getUuid()}`);
        res.on('value', (value) => console.log(`All Temps[${res.getUuid()}]:`, value));
      });
    }

    load(messageCenter) {
      return Promise.resolve()
        .then(() => this._cpuTemp.load(messageCenter))
        .then(() => this._allTemps.load(messageCenter));
    }

    unload() {
      return Promise.resolve()
        .then(() => this._allTemps.unload())
        .then(() => this._cpuTemp.unload());
    }
  }

  module.exports = new ModuleApp();
})();
