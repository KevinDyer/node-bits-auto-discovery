(() => {
  'use strict';

  const uuidv4 = require('uuid/v4');
  const {isNonEmptyString, isNonNullObject} = require('./utils');
  const TopicFilter = require('./topic-filter');

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
      this._boundOnPing = this._onPing.bind(this);
      this._messageCenter = null;
    }

    _onPing(data) {
      if (!isNonNullObject(data)) {
        return;
      }
      const {topic} = data;
      const topicFilter = TopicFilter.fromTopic(topic);
      if (!topicFilter.isMatch(this._topic)) {
        return;
      }
      this._sendPong();
    }

    load(messageCenter) {
      return Promise.resolve()
        .then(() => {
          this._messageCenter = messageCenter;
        })
        .then(() => this._messageCenter.addEventListener('bits#AutoDiscovery#Ping', null, this._boundOnPing))
        .then(() => this._sendPong());
    }

    unload() {
      return Promise.resolve()
        .then(() => this._messageCenter.removeEventListener('bits#AutoDiscovery#Ping', this._boundOnPing))
        .then(() => this._messageCenter.sendEvent('bits#AutoDiscovery#Remove', null, {topic: this._topic, uuid: this._uuid}))
        .then(() => {
          this._messageCenter = null;
        });
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
      this._sendPong();
    }

    _sendPong() {
      if (null !== this._messageCenter) {
        const data = {topic: this._topic, uuid: this._uuid, value: this._value};
        this._messageCenter.sendEvent('bits#AutoDiscovery#Pong', null, data);
      }
    }
  }

  module.exports = LocalResource;
})();
