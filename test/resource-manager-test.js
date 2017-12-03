(() => {
  'use strict';

  const chai = require('chai');
  const {ResourceManager} = require('..');
  const MockMessageCenter = require('./mocks/mock-message-center');
  const expect = chai.expect;

  describe('ResourceManager', () => {
    let resourceManager = null;
    beforeEach('Create resourceManager', () => {
      resourceManager = new ResourceManager({topic: 'test'});
    });

    let messageCenter = null;
    beforeEach('Create message center', () => {
      messageCenter = new MockMessageCenter();
    });

    describe('constructor', () => {
      it('should create a resource manager', () => {
        expect(new ResourceManager({topic: 'test'})).to.be.instanceof(ResourceManager);
      });

      it('should throw TypeError if no topic', () => {
        expect(() => {
          new ResourceManager({});
        }).to.throw('topic must be a non-empty string');
      });
    });

    describe('load', () => {
      it('should run', () => {
        return resourceManager.load(messageCenter);
      });

      it('should return a Promise', () => {
        expect(resourceManager.load(messageCenter)).to.be.instanceof(Promise);
      });

      it('should add resource add event listener', (done) => {
        const timeout = setTimeout(() => done(new Error('did not add listener')), 5);
        messageCenter.on('addEventListener', (event, metadata, listener) => {
          if ('auto-discovery#Add' !== event) {
            return;
          }
          clearTimeout(timeout);
          expect(metadata).to.be.null;
          expect('function' === typeof(listener)).to.be.true;
          done();
        });
        Promise.resolve()
        .then(() => resourceManager.load(messageCenter))
        .catch(done);
      });

      it('should add resource remove event listener', (done) => {
        const timeout = setTimeout(() => done(new Error('did not add listener')), 5);
        messageCenter.on('addEventListener', (event, metadata, listener) => {
          if ('auto-discovery#Remove' !== event) {
            return;
          }
          clearTimeout(timeout);
          expect(metadata).to.be.null;
          expect('function' === typeof(listener)).to.be.true;
          done();
        });
        Promise.resolve()
        .then(() => resourceManager.load(messageCenter))
        .catch(done);
      });
    });

    describe('unload', () => {
      beforeEach('Load resource', () => {
        return resourceManager.load(messageCenter);
      });

      it('should run', () => {
        return resourceManager.unload();
      });

      it('should return a Promise', () => {
        expect(resourceManager.unload()).to.be.instanceof(Promise);
      });

      it('should remove resource add event listener', (done) => {
        const timeout = setTimeout(() => done(new Error('did not remove listener')), 5);
        messageCenter.on('removeEventListener', (event, listener) => {
          if ('auto-discovery#Add' !== event) {
            return;
          }
          clearTimeout(timeout);
          expect('function' === typeof(listener)).to.be.true;
          done();
        });
        Promise.resolve()
        .then(() => resourceManager.unload())
        .catch(done);
      });

      it('should remove resource remove event listener', (done) => {
        const timeout = setTimeout(() => done(new Error('did not remove listener')), 5);
        messageCenter.on('removeEventListener', (event, listener) => {
          if ('auto-discovery#Remove' !== event) {
            return;
          }
          clearTimeout(timeout);
          expect('function' === typeof(listener)).to.be.true;
          done();
        });
        Promise.resolve()
        .then(() => resourceManager.unload())
        .catch(done);
      });
    });
  });
})();
