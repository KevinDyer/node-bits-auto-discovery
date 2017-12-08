(() => {
  'use strict';

  const chai = require('chai');
  const {LocalResource, RemoteResource, ResourceManager} = require('..');
  const MockMessageCenter = require('./mocks/mock-message-center');

  const expect = chai.expect;

  describe('ResourceManager', () => {
    let messageCenter = null;
    beforeEach('Create message center', () => {
      messageCenter = new MockMessageCenter();
    });

    let resourceManager = null;
    beforeEach('Create local resource', () => {
      resourceManager = new ResourceManager({topic: 'test'});
    });

    describe('constructor', () => {
      it('should accept a topic of type string', () => {
        expect(() => {
          new ResourceManager({topic: 'test'});
        }).to.not.throw;
      });
      it.skip('should accept a topic of type RegExp', () => {
        expect(() => {
          new ResourceManager({topic: new RegExp('test')});
        }).to.not.throw;
      });
      it('should throw TypeError is topic is not a string or RegExp', () => {
        expect(() => {
          new ResourceManager({});
        }).to.throw(TypeError, /topic/ );
        expect(() => {
          new ResourceManager({topic: true});
        }).to.throw(TypeError, /topic/ );
        expect(() => {
          new ResourceManager({topic: 42});
        }).to.throw(TypeError, /topic/ );
        expect(() => {
          new ResourceManager({topic: {}});
        }).to.throw(TypeError, /topic/ );
        expect(() => {
          new ResourceManager({topic: []});
        }).to.throw(TypeError, /topic/ );
        expect(() => {
          new ResourceManager({topic: null});
        }).to.throw(TypeError, /topic/ );
        expect(() => {
          new ResourceManager({topic: function() {}});
        }).to.throw(TypeError, /topic/ );
      });
    });

    describe('load', () => {
      it('should return a Promise', () => {
        const promise = resourceManager.load(messageCenter);
        expect(promise).to.be.instanceof(Promise);
        promise.catch(() => null);
      });

      it('should add pong event listener', (done) => {
        const timeout = setTimeout(() => done(new Error('did not add event listener')), 5);

        messageCenter.on('addEventListener', (event, metadata, listener) => {
          if ('bits#AutoDiscovery#Pong' === event) {
            clearTimeout(timeout);
            expect(metadata).to.be.null;
            expect(listener).to.be.a('function');
            done();
          }
        });

        resourceManager.load(messageCenter);
      });

      it('should add remove event listener', (done) => {
        const timeout = setTimeout(() => done(new Error('did not add event listener')), 5);

        messageCenter.on('addEventListener', (event, metadata, listener) => {
          if ('bits#AutoDiscovery#Remove' === event) {
            clearTimeout(timeout);
            expect(metadata).to.be.null;
            expect(listener).to.be.a('function');
            done();
          }
        });

        resourceManager.load(messageCenter);
      });

      it('should send ping event', (done) => {
        const timeout = setTimeout(() => done(new Error('did not send event')), 5);

        messageCenter.on('sendEvent', (event, metadata, {topic}) => {
          if ('bits#AutoDiscovery#Ping' === event) {
            clearTimeout(timeout);
            expect(metadata).to.be.null;
            expect(topic).to.equal('test');
            done();
          }
        });

        resourceManager.load(messageCenter);
      });

      it('should not send ping event if pingOnLoad is false', (done) => {
        const timeout = setTimeout(done, 5);

        messageCenter.on('sendEvent', (event) => {
          if ('bits#AutoDiscovery#Ping' === event) {
            clearTimeout(timeout);
            done(new Error('did send event'));
          }
        });

        const resourceManager = new ResourceManager({topic: 'test', pingOnLoad: false});
        resourceManager.load(messageCenter);
      });
    });

    describe('unload', () => {
      beforeEach('Load resource manager', () => {
        return resourceManager.load(messageCenter);
      });

      it('should return a Promise', () => {
        const promise = resourceManager.unload();
        expect(promise).to.be.instanceof(Promise);
        promise.catch(() => null);
      });

      it('should remove pong event listener', (done) => {
        const timeout = setTimeout(() => done(new Error('did not remove event listener')), 5);

        messageCenter.on('removeEventListener', (event, listener) => {
          if ('bits#AutoDiscovery#Pong' === event) {
            clearTimeout(timeout);
            expect(listener).to.be.a('function');
            done();
          }
        });

        resourceManager.unload();
      });

      it('should remove remove event listener', (done) => {
        const timeout = setTimeout(() => done(new Error('did not remove event listener')), 5);

        messageCenter.on('removeEventListener', (event, listener) => {
          if ('bits#AutoDiscovery#Remove' === event) {
            clearTimeout(timeout);
            expect(listener).to.be.a('function');
            done();
          }
        });

        resourceManager.unload();
      });
    });

    describe('ping', () => {
      beforeEach('Load resource manager', () => {
        return resourceManager.load(messageCenter);
      });

      it('should send ping event', (done) => {
        const timeout = setTimeout(() => done(new Error('did not send event')), 5);

        messageCenter.on('sendEvent', (event, metadata, {topic}) => {
          if ('bits#AutoDiscovery#Ping' === event) {
            clearTimeout(timeout);
            expect(metadata).to.be.null;
            expect(topic).to.equal('test');
            done();
          }
        });

        resourceManager.ping();
      });
    });

    describe('Event \'add\'', () => {
      beforeEach('Load resource manager', () => {
        return resourceManager.load(messageCenter);
      });

      it('should emit on pong event', (done) => {
        const timeout = setTimeout(() => done(new Error('did not emit event')), 5);

        resourceManager.on('add', (resource) => {
          clearTimeout(timeout);
          expect(resource).to.be.instanceof(RemoteResource);
          expect(resource.getTopic()).to.equal('test');
          expect(resource.getUuid()).to.equal('my-uuid');
          done();
        });

        messageCenter.sendEvent('bits#AutoDiscovery#Pong', null, {topic: 'test', uuid: 'my-uuid'});
      });

      it('should not emit on second pong event', (done) => {
        messageCenter.sendEvent('bits#AutoDiscovery#Pong', null, {topic: 'test', uuid: 'my-uuid'});

        const timeout = setTimeout(done, 5);

        resourceManager.on('add', () => {
          clearTimeout(timeout);
          done(new Error('did emit event'));
        });

        messageCenter.sendEvent('bits#AutoDiscovery#Pong', null, {topic: 'test', uuid: 'my-uuid'});
      });

      it('should not emit is pong topic does not match', (done) => {
        const timeout = setTimeout(done, 5);

        resourceManager.on('add', () => {
          clearTimeout(timeout);
          done(new Error('did emit event'));
        });

        messageCenter.sendEvent('bits#AutoDiscovery#Pong', null, {topic: 'not-test', uuid: 'my-uuid'});
      });
    });

    describe('Event \'remove\'', () => {
      beforeEach('Load resource manager', () => {
        return resourceManager.load(messageCenter);
      });

      let localResource = null;
      beforeEach('Create local resource', () => {
        localResource = new LocalResource({topic: 'test', value: 1});
      });

      beforeEach('Load local resource', () => {
        return localResource.load(messageCenter);
      });

      it('should emit on remove event', (done) => {
        const timeout = setTimeout(() => done(new Error('did not emit event')), 5);

        resourceManager.on('remove', (resource) => {
          clearTimeout(timeout);
          expect(resource).to.be.instanceof(RemoteResource);
          expect(resource.getTopic()).to.equal('test');
          expect(resource.getUuid()).to.equal(localResource.getUuid());
          done();
        });

        messageCenter.sendEvent('bits#AutoDiscovery#Remove', null, {topic: 'test', uuid: localResource.getUuid()});
      });

      it('should not emit on remove event for uuid that is not added', (done) => {
        const timeout = setTimeout(done, 5);

        resourceManager.on('remove', () => {
          clearTimeout(timeout);
          done(new Error('did emit event'));
        });

        messageCenter.sendEvent('bits#AutoDiscovery#Remove', null, {topic: 'test', uuid: 'does-not-exist'});
      });
    });
  });
})();
