(() => {
  'use strict';

  const chai = require('chai');
  const {Resource} = require('..');
  const MockMessageCenter = require('./mocks/mock-message-center');
  const expect = chai.expect;

  describe('Resource', () => {
    let resource = null;
    beforeEach('Create resource', () => {
      resource = new Resource({topic: 'test', name: 'a'});
    });

    let messageCenter = null;
    beforeEach('Create message center', () => {
      messageCenter = new MockMessageCenter();
    });

    describe('constructor', () => {
      it('should create a Resource', () => {
        expect(new Resource({topic: 'test', name: 'a'})).to.be.instanceof(Resource);
      });
      it('should throw TypeError if no topic', () => {
        expect(() => {
          new Resource({name: 'a'});
        }).to.throw('topic must be a non-empty string');
      });
      it('should throw TypeError if no name', () => {
        expect(() => {
          new Resource({topic: 'test'});
        }).to.throw('name must be a non-empty string');
      });
      it('should not fail if data is passed', () => {
        expect(() => {
          new Resource({topic: 'test', name: 'a', data: null});
        }).to.not.throw();
      });
    });

    describe('load', () => {
      it('should run', () => {
        return resource.load(messageCenter);
      });
      it('should return a Promise', () => {
        expect(resource.load(messageCenter)).to.be.instanceof(Promise);
      });
      it('should send resource add event', (done) => {
        const timeout = setTimeout(() => done(new Error('did not sendEvent')), 5);
        messageCenter.on('sendEvent', (event, metadata, {topic, name}) => {
          clearTimeout(timeout);
          expect(event).to.equal('auto-discovery#Add');
          expect(metadata).to.be.null;
          expect(topic).to.equal('test');
          expect(name).to.equal('a');
          done();
        });
        resource.load(messageCenter);
      });
      it('should send resource add event with data', (done) => {
        const resource = new Resource({topic: 'test', name: 'a', data: 42});
        const timeout = setTimeout(() => done(new Error('did not sendEvent')), 5);
        messageCenter.on('sendEvent', (event, metadata, {topic, name, data}) => {
          clearTimeout(timeout);
          expect(event).to.equal('auto-discovery#Add');
          expect(metadata).to.be.null;
          expect(topic).to.equal('test');
          expect(name).to.equal('a');
          expect(data).to.equal(42);
          done();
        });
        resource.load(messageCenter);
      });
      it('should add resource query event listener', (done) => {
        const timeout = setTimeout(() => done(new Error('did not addEventListener')), 5);
        messageCenter.on('addEventListener', (event, metadata, callback) => {
          clearTimeout(timeout);
          expect(event).to.equal('auto-discovery#Query');
          expect(metadata).to.be.null;
          expect('function' === typeof(callback)).to.be.true;
          done();
        });
        resource.load(messageCenter);
      });
    });

    describe('unload', () => {
      beforeEach('Load resource', () => {
        return resource.load(messageCenter);
      });

      it('should run', () => {
        return resource.unload();
      });
      it('should return a Promise', () => {
        expect(resource.unload()).to.be.instanceof(Promise);
      });
      it('should send resource remove event', (done) => {
        const timeout = setTimeout(() => done(new Error('did not sendEvent')), 5);
        messageCenter.on('sendEvent', (event, metadata, {topic, name}) => {
          clearTimeout(timeout);
          expect(event).to.equal('auto-discovery#Remove');
          expect(metadata).to.be.null;
          expect(topic).to.equal('test');
          expect(name).to.equal('a');
          done();
        });
        resource.unload();
      });
      it('should remove resource query event listener', (done) => {
        const timeout = setTimeout(() => done(new Error('did not removeEventListener')), 5);
        messageCenter.on('removeEventListener', (event, callback) => {
          clearTimeout(timeout);
          expect(event).to.equal('auto-discovery#Query');
          expect('function' === typeof(callback)).to.be.true;
          done();
        });
        resource.unload();
      });
    });

    it('should send resource add event on resource query event', (done) => {
      const timeout = setTimeout(() => done(new Error('did not send event')), 5);
      Promise.resolve()
        .then(() => resource.load(messageCenter))
        .then(() => {
          messageCenter.on('sendEvent', (event, metadata, {topic, name}) => {
            if ('auto-discovery#Add' === event) {
              clearTimeout(timeout);
              expect(metadata).to.be.null;
              expect(topic).to.equal('test');
              expect(name).to.equal('a');
              done();
            }
          });
        })
        .then(() => messageCenter.sendEvent('auto-discovery#Query', null, {topic: 'test'}))
        .catch(done);
    });

    it('should send resource add event with data on resource query event', (done) => {
      const resource = new Resource({topic: 'test', name: 'a', data: 42});
      const timeout = setTimeout(() => done(new Error('did not send event')), 5);
      Promise.resolve()
        .then(() => resource.load(messageCenter))
        .then(() => {
          messageCenter.on('sendEvent', (event, metadata, {topic, name, data}) => {
            if ('auto-discovery#Add' === event) {
              clearTimeout(timeout);
              expect(metadata).to.be.null;
              expect(topic).to.equal('test');
              expect(name).to.equal('a');
              expect(data).to.equal(42);
              done();
            }
          });
        })
        .then(() => messageCenter.sendEvent('auto-discovery#Query', null, {topic: 'test'}))
        .catch(done);
    });

    it('should not send resource add event on resource query event with different topic', (done) => {
      const timeout = setTimeout(() => done(), 5);
      Promise.resolve()
        .then(() => resource.load(messageCenter))
        .then(() => {
          messageCenter.on('sendEvent', (event, metadata, {topic, name}) => {
            if ('auto-discovery#Add' === event) {
              clearTimeout(timeout);
              done(new Error('did send event'));
            }
          });
        })
        .then(() => messageCenter.sendEvent('auto-discovery#Query', null, {topic: 'not-test'}))
        .catch(done);
    });
  });
})();
