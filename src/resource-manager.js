(() => {
  'use strict';

  const DEFAULT_DELAY = 50;

  const crypto = require('crypto');
  const EventEmitter = require('events');

  class ResourceManager extends EventEmitter {
    constructor({topic, delay=DEFAULT_DELAY}) {
      super();
      if ('string' !== typeof(topic) || 0 >= topic.length) {
        throw new TypeError('topic must be a non-empty string');
      }
      this._topic = topic;
      this.setDelay(delay);
      this._boundOnAdd = this._onAdd.bind(this);
      this._boundOnRemove = this._onRemove.bind(this);
      this._messageCenter = null;
    }

    setDelay(delay) {
      if (isNaN(parseInt(delay))) {
        delay = DEFAULT_DELAY;
      }
      this._delay = delay;
    }

    getDelay() {
      return this._delay;
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

    getResources() {
      return Promise.resolve()
        .then(() => this._randomBytes(8))
        .then((buf) => {
          return new Promise((resolve, reject) => {
            const id = buf.toString('hex');
            const resources = [];
            const onQueryResponse = (metadata, data) => {
              const {queryId} = data;
              if (id !== queryId) {
                return;
              }
              delete data.queryId;
              resources.push(data);
            };
            Promise.resolve()
              .then(() => this._messageCenter.addEventListener('auto-discovery#QueryResponse', null, onQueryResponse))
              .then(() => {
                return new Promise((resolve, reject) => {
                  setTimeout(resolve, this._delay);
                  Promise.resolve()
                    .then(() => this._messageCenter.sendEvent('auto-discovery#Query', null, {
                      topic: this._topic,
                      queryId: id,
                    }))
                    .catch(reject);
                });
              })
              .then(() => this._messageCenter.removeEventListener('auto-discovery#QueryResponse', onQueryResponse))
              .then(() => resolve(resources))
              .catch(reject);
          });
        });
    }

    _randomBytes(size) {
      return new Promise((resolve, reject) => {
        crypto.randomBytes(size, (err, buf) => {
          if (err) {
            reject(err);
          } else {
            resolve(buf);
          }
        });
      });
    }
  }

  module.exports = ResourceManager;
})();
