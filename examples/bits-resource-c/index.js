(() => {
  'use strict';

  const UUID = 'ec521c5d-7620-4a4d-9226-a69ee6c776bf';

  const {LocalResource} = require('../..');

  class ModuleApp {
    constructor() {
      this._resource = new LocalResource({
        topic: 'not-simple',
        uuid: UUID,
        value: 'things',
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
