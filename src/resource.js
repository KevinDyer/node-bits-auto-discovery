(() => {
  'use strict';

  class Resource {
    constructor({topic, name, data}) {
      if ('string' !== typeof(topic) || 0 >= topic.length) {
        return new TypeError('topic must be a non-empty string');
      }
      this._topic = topic;
      if ('string' !== typeof(name) || 0 >= name.length) {
        return new TypeError('name must be a non-empty string');
      }
      this._name = name;
      this._data = data;
      this._boundOnQuery = this._onQuery.bind(this);
      this._messageCenter = null;
    }

    load(messageCenter) {
      return Promise.resolve()
        .then(() => {
          this._messageCenter = messageCenter;
        })
        .then(() => this._addDiscoveryQueryListener())
        .then(() => this._sendResourceAddEvent());
    }

    unload() {
      return Promise.resolve()
      .then(() => this._sendResourceRemoveEvent())
      .then(() => this._removeResourceQueryListener())
      .then(() => {
        this._messageCenter = null;
      });
    }

    _onQuery(metadata, {topic}) {
      if (this._topic === topic) {
        this._sendResourceAddEvent();
      }
    }

    _addDiscoveryQueryListener() {
      return this._messageCenter.addEventListener('auto-discovery#Query', null, this._boundOnQuery);
    }

    _removeDiscoveryQueryListener() {
      return this._messageCenter.removeEventListener('auto-discovery#Query', this._boundOnQuery);
    }

    _sendResourceAddEvent() {
      const data = {topic: this._topic, name: this._name, data: this._data};
      return this._messageCenter.sendEvent('auto-discovery#Add', null, data);
    }

    _sendResourceRemoveEvent() {
      const data = {topic: this._topic, name: this._name};
      return this._messageCenter.sendEvent('auto-discovery#Remove', null, data);
    }
  }

  module.exports = Resource;
})();
