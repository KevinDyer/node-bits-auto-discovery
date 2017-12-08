(() => {
  'use strict';

  const EventEmitter = require('events');
  const {isNonEmptyString} = require('./utils');

  class RemoteResource extends EventEmitter {
    static verify(data) {
      return true;
    }

    constructor({topic, uuid, value=null}={}) {
      super();
      if (!isNonEmptyString(topic)) {
        throw new TypeError('topic must be a non-empty string');
      }
      this._topic = topic;
      if (!isNonEmptyString(uuid)) {
        throw new TypeError('uuid must be a non-empty string');
      }
      this._uuid = uuid;
      this._value = value;
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
      this.emit('value', this.getValue());
    }
  }

  module.exports = RemoteResource;
})();
