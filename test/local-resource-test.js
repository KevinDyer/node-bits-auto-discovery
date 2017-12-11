(() => {
  'use strict';

  const chai = require('chai');
  const {LocalResource} = require('..');
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

      it('should send pong event', (done) => {
        const timeout = setTimeout(() => done(new Error('did not send event')), 5);

        messageCenter.on('sendEvent', (event, metadata, {topic}) => {
          if ('bits#AutoDiscovery#Pong' === event) {
            clearTimeout(timeout);
            expect(metadata).to.be.null;
            expect(topic).to.equal('test');
            done();
          }
        });

        localResource.load(messageCenter);
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

      it('should send remove event', (done) => {
        const timeout = setTimeout(() => done(new Error('did not send event')), 5);

        messageCenter.on('sendEvent', (event, metadata, {topic}) => {
          if ('bits#AutoDiscovery#Remove' === event) {
            clearTimeout(timeout);
            expect(metadata).to.be.null;
            expect(topic).to.equal('test');
            done();
          }
        });

        localResource.unload();
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

      it('should send pong event', (done) => {
        const timeout = setTimeout(() => done(new Error('did not send event')), 5);

        messageCenter.on('sendEvent', (event, metadata, {topic, uuid, value}) => {
          if ('bits#AutoDiscovery#Pong' === event) {
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

      it('should not send pong event if value is the same', (done) => {
        const timeout = setTimeout(done, 5);

        messageCenter.on('sendEvent', (event) => {
          if ('bits#AutoDiscovery#Pong' === event) {
            clearTimeout(timeout);
            done(new Error('did send event'));
          }
        });

        localResource.setValue(localResource.getValue());
      });
    });

    describe('Event \'pong\'', () => {
      beforeEach('Load local resource', () => {
        return localResource.load(messageCenter);
      });

      beforeEach('Set value to 42', () => {
        localResource.setValue(42);
      });

      it('should send event on a ping event', (done) => {
        const timeout = setTimeout(() => done(new Error('did not send event')), 5);

        messageCenter.on('sendEvent', (event, metadata, {topic, uuid, value}) => {
          if ('bits#AutoDiscovery#Pong' === event) {
            clearTimeout(timeout);
            expect(metadata).to.be.null;
            expect(topic).to.equal('test');
            expect(uuid).to.be.a('string');
            expect(value).to.equal(42);
            done();
          }
        });

        messageCenter.sendEvent('bits#AutoDiscovery#Ping', null, {topic: {type: 'string', data: 'test'}});
      });

      it('should not send event if ping topic does not match', (done) => {
        const timeout = setTimeout(done, 5);

        messageCenter.on('sendEvent', (event) => {
          if ('bits#AutoDiscovery#Pong' === event) {
            clearTimeout(timeout);
            done(new Error('did send event'));
          }
        });

        messageCenter.sendEvent('bits#AutoDiscovery#Ping', null, {topic: {type: 'string', data: 'not-test'}});
      });

      it('should send event if topic matches ping topic expession', (done) => {
        const timeout = setTimeout(() => done(new Error('did not send event')), 5);

        messageCenter.on('sendEvent', (event, metadata, {topic, uuid, value}) => {
          if ('bits#AutoDiscovery#Pong' === event) {
            clearTimeout(timeout);
            expect(metadata).to.be.null;
            expect(topic).to.equal('test');
            expect(uuid).to.be.a('string');
            expect(value).to.equal(42);
            done();
          }
        });

        messageCenter.sendEvent('bits#AutoDiscovery#Ping', null, {topic: {type: 'regex', data: 'es'}});
      });
    });
  });
})();
