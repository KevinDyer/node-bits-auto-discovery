(() => {
  'use strict';

  const {LocalResource} = require('..');
  const chai = require('chai');
  const MockMessageCenter = require('./mocks/mock-message-center');

  const expect = chai.expect;

  describe('LocalResource', () => {
    let messageCenter = null;
    beforeEach('Create message center', () => {
      messageCenter = new MockMessageCenter();
    });

    let localResource = null;
    beforeEach('Create local resource', () => {
      localResource = new LocalResource({topic: 'test'});
    });

    describe('constructor', () => {
      it('should throw TypeError if topic is not a string', () => {
        expect(function() {
          return new LocalResource({});
        }).to.throw(TypeError, /topic/);
      });

      it('should generate a UUID', () => {
        const localResource = new LocalResource({topic: 'test'});
        expect(localResource.getUuid()).to.be.a('string');
      });

      it('should throw TypeError if uuid is not a string', () => {
        expect(function() {
          return new LocalResource({topic: 'test', uuid: 42});
        }).to.throw(TypeError, /uuid/);
      });

      it('should use the passed in UUID', () => {
        const localResource = new LocalResource({topic: 'test', uuid: 'my-uuid'});
        expect(localResource.getUuid()).to.equal('my-uuid');
      });

      it('should use the passed in value', () => {
        const localResource = new LocalResource({topic: 'test', value: 'my-value'});
        expect(localResource.getValue()).to.equal('my-value');
      });
    });

    describe('load', () => {
      it('should return a Promise', () => {
        const promise = localResource.load(messageCenter);
        expect(promise).to.be.instanceof(Promise);
        promise.catch(() => null);
      });
    });

    describe('unload', () => {
      beforeEach('Load local resource', () => {
        return localResource.load(messageCenter);
      });

      it('should return a Promise', () => {
        const promise = localResource.unload();
        expect(promise).to.be.instanceof(Promise);
        promise.catch(() => null);
      });
    });

    describe('setValue', () => {
      beforeEach('Load local resource', () => {
        return localResource.load(messageCenter);
      });

      it('should set the value', () => {
        localResource.setValue(42);
        expect(localResource.getValue()).to.equal(42);
      });

      it('should send value event', (done) => {
        const timeout = setTimeout(() => done(new Error('did not send event')), 5);

        messageCenter.on('sendEvent', (event, metadata, {topic, uuid, value}) => {
          if ('auto-discovery#Value' === event) {
            clearTimeout(timeout);
            expect(metadata).to.be.null;
            expect(topic).to.equal('test');
            expect(uuid).to.be.a('string');
            expect(value).to.equal(42);
            done();
          }
        });

        localResource.setValue(42);
      });

      it('should not send value event if value is the same', (done) => {
        const timeout = setTimeout(done, 5);

        messageCenter.on('sendEvent', (event) => {
          if ('auto-discovery#Value' === event) {
            clearTimeout(timeout);
            done(new Error('did send event'));
          }
        });

        localResource.setValue(localResource.getValue());
      });
    });

    describe('Event \'value\'', () => {
      beforeEach('Load local resource', () => {
        return localResource.load(messageCenter);
      });

      beforeEach('Set value to 42', () => {
        localResource.setValue(42);
      });

      it('should send value event on a query event', (done) => {
        const timeout = setTimeout(() => done(new Error('did not send event')), 5);

        messageCenter.on('sendEvent', (event, metadata, {topic, uuid, value}) => {
          if ('auto-discovery#Value' === event) {
            clearTimeout(timeout);
            expect(metadata).to.be.null;
            expect(topic).to.equal('test');
            expect(uuid).to.be.a('string');
            expect(value).to.equal(42);
            done();
          }
        });

        const data = {};
        messageCenter.sendEvent('auto-discovery#Query', null, data);
      });
    });
  });
})();
