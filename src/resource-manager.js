(() => {
  'use strict';

  const EventEmitter = require('events');

  class ResourceManager extends EventEmitter {
    constructor({topic}) {
      super();
      if ('string' !== typeof(topic) || 0 >= topic.length) {
        throw new TypeError('topic must be a non-empty string');
      }
      this._topic = topic;
      this._boundOnAdd = this._onAdd.bind(this);
      this._boundOnRemove = this._onRemove.bind(this);
      this._messageCenter = null;
    }

    _onAdd() {

    }

    _onRemove() {

    }

    load(messageCenter) {
      return Promise.resolve()
        .then(() => {
          this._messageCenter = messageCenter;
        })
        .then(() => this._addResourceListeners());
    }

    unload() {
      return Promise.resolve()
        .then(() => this._removeResourceListeners())
        .then(() => {
          this._messageCenter = null;
        });
    }

    _addResourceListeners() {
      return this._messageCenter.addEventListener('auto-discovery#Add', null, this._boundOnAdd)
        .then(() => this._messageCenter.addEventListener('auto-discovery#Remove', null, this._boundOnRemove));
    }

    _removeResourceListeners() {
      return this._messageCenter.removeEventListener('auto-discovery#Add', this._boundOnAdd)
        .then(() => this._messageCenter.removeEventListener('auto-discovery#Remove', this._boundOnRemove));
    }
  }

  module.exports = ResourceManager;
})();
