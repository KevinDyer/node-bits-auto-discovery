(() => {
  'use strict';

  const chai = require('chai');
  const {RemoteResource} = require('..');

  const expect = chai.expect;

  describe('RemoteResource', () => {
    describe('constructor', () => {
      it('should throw TypeError if topic is not a string', () => {
        expect(() => {
          return new RemoteResource({});
        }).to.throw(TypeError, /topic/);
      });

      it('should throw TypeError if uuid is not a string', () => {
        expect(() => {
          return new RemoteResource({topic: 'test', uuid: 42});
        }).to.throw(TypeError, /uuid/);
      });

      it('should use the passed in UUID', () => {
        const removeResource = new RemoteResource({topic: 'test', uuid: 'my-uuid'});
        expect(removeResource.getUuid()).to.equal('my-uuid');
      });

      it('should use the passed in value', () => {
        const removeResource = new RemoteResource({topic: 'test', uuid: 'my-uuid', value: 'my-value'});
        expect(removeResource.getValue()).to.equal('my-value');
      });
    });

    describe('setValue', () => {
      let remoteResource = null;
      beforeEach('Create remote resource', () => {
        remoteResource = new RemoteResource({topic: 'test', uuid: 'my-uuid'});
      });

      it('should set the value', () => {
        remoteResource.setValue(42);
        expect(remoteResource.getValue()).to.equal(42);
      });

      it('should emit value event', (done) => {
        const timeout = setTimeout(() => done(new Error('did not emit event')), 5);
        remoteResource.on('value', (value) => {
          clearTimeout(timeout);
          expect(value).to.equal(42);
          done();
        });
        remoteResource.setValue(42);
      });

      it('should not emit value event if value is the same', (done) => {
        remoteResource.setValue(42);
        const timeout = setTimeout(done, 5);
        remoteResource.on('value', () => {
          clearTimeout(timeout);
          done(new Error('did send event'));
        });
        remoteResource.setValue(42);
      });
    });
  });
})();
