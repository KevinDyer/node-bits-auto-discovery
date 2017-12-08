(() => {
  'use strict';

  const UUID = 'f90777d1-9021-47aa-82cc-a6dc747a6308';

  const {LocalResource} = require('../..');

  class ModuleApp {
    constructor() {
      this._resource = new LocalResource({
        topic: 'simple',
        uuid: UUID,
        value: 'myValue',
      });
    }

    load(messageCenter) {
      return Promise.resolve()
        .then(() => this._resource.load(messageCenter));
    }

    unload() {
      return Promise.resolve()
        .then(() => this._resource.unload());
    }
  }

  module.exports = new ModuleApp();
})();
