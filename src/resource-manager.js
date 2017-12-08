
(() => {
  'use strict';

  const EventEmitter = require('events');
  const RemoteResource = require('./remote-resource');

  class ResourceManager extends EventEmitter {
    constructor({topic, pingOnLoad=true}) {
      super();
      if (!(topic instanceof RegExp) && 'string' !== typeof(topic)) {
        throw new TypeError('topic must be a RegExp or string');
      }
      this._topic = topic;
      this._pingOnLoad = true === pingOnLoad;
      this._boundOnPong = this._onPong.bind(this);
      this._boundOnRemove = this._onRemove.bind(this);
      this._resources = new Map();
      this._messageCenter = null;
    }

    _onPong(metadata, {topic, uuid, value}) {
      // TODO: validate topic
      // TODO: filter topic
      // TODO: validate uuid
      if (!this._resources.has(uuid)) {
        const resource = new RemoteResource({topic: topic, uuid: uuid, value: value});
        this._resources.set(uuid, resource);
        this.emit('add', resource);
      }
    }

    _onRemove(metadata, {topic, uuid, value}) {
      // TODO: validate topic?
      // TODO: filter topic?
      // TODO: validate uuid
      if (!this._resources.has(uuid)) {
        return;
      }
      const resource = this._resources.get(uuid);
      this.emit('remove', resource);
    }

    load(messageCenter) {
      return Promise.resolve()
        .then(() => {
          this._messageCenter = messageCenter;
        })
        .then(() => this._messageCenter.addEventListener('bits#AutoDiscovery#Pong', null, this._boundOnPong))
        .then(() => this._messageCenter.addEventListener('bits#AutoDiscovery#Remove', null, this._boundOnRemove))
        .then(() => {
          if (this._pingOnLoad) {
            return this.ping();
          }
        });
    }

    unload() {
      return Promise.resolve()
        .then(() => this._messageCenter.removeEventListener('bits#AutoDiscovery#Remove', this._boundOnRemove))
        .then(() => this._messageCenter.removeEventListener('bits#AutoDiscovery#Pong', this._boundOnPong))
        .then(() => {
          this._messageCenter = null;
        });
    }

    ping() {
      const data = {topic: this._topic};
      return this._messageCenter.sendEvent('bits#AutoDiscovery#Ping', null, data);
    }
  }

  module.exports = ResourceManager;
})();
