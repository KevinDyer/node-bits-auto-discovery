(() => {
  'use strict';

  const uuidv4 = require('uuid/v4');
  const {isNonEmptyString} = require('./utils');

  function createUuid() {
    return uuidv4();
  }

  class LocalResource {
    constructor({topic, uuid=createUuid(), value=null}={}) {
      if (!isNonEmptyString(topic)) {
        throw new TypeError('topic must be a non-empty string');
      }
      this._topic = topic;
      if (!isNonEmptyString(uuid)) {
        throw new TypeError('uuid must be a non-empty string');
      }
      this._uuid = uuid;
      this._value = value;
      this._messageCenter = null;
      this._boundOnQuery = this._onQuery.bind(this);
    }

    _onQuery() {
      this._sendValue();
    }

    load(messageCenter) {
      this._messageCenter = messageCenter;
      this._messageCenter.addEventListener('auto-discovery#Query', null, this._boundOnQuery);
      return Promise.resolve();
    }

    unload() {
      this._messageCenter.removeEventListener('auto-discovery#Query', this._boundOnQuery);
      this._messageCenter = null;
      return Promise.resolve();
    }

    getTopic() {
      return this._topic;
    }

    getUuid() {
      return this._uuid;
    }

    getValue() {
      return this._value;
    }

    setValue(value) {
      const oldValue = this.getValue();
      if (oldValue === value) {
        return;
      }
      this._value = value;
      this._sendValue();
    }

    _sendValue() {
      const data = {topic: this._topic, uuid: this._uuid, value: this._value};
      this._messageCenter.sendEvent('auto-discovery#Value', null, data);
    }
  }

  module.exports = LocalResource;
})();
