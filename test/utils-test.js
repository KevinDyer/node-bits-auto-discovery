(() => {
  'use strict';

  const chai = require('chai');
  const {isNonEmptyString, isNonNullObject} = require('../src/utils');

  const expect = chai.expect;

  describe('utils', () => {
    describe('isNonEmptyString', () => {
      it('should return false for undefined', () => {
        expect(isNonEmptyString()).to.be.false;
      });
      it('should return false for boolean', () => {
        expect(isNonEmptyString(false)).to.be.false;
      });
      it('should return false for number', () => {
        expect(isNonEmptyString(42)).to.be.false;
      });
      it('should return true for a string', () => {
        expect(isNonEmptyString('str')).to.be.true;
      });
      it('should return false for null', () => {
        expect(isNonEmptyString(null)).to.be.false;
      });
      it('should return false for Object', () => {
        expect(isNonEmptyString({})).to.be.false;
      });
      it('should return false for Array', () => {
        expect(isNonEmptyString([])).to.be.false;
      });
    });

    describe('isNonNullObject', () => {
      it('should return false for undefined', () => {
        expect(isNonNullObject()).to.be.false;
      });
      it('should return false for boolean', () => {
        expect(isNonNullObject(false)).to.be.false;
      });
      it('should return false for number', () => {
        expect(isNonNullObject(42)).to.be.false;
      });
      it('should return true for a string', () => {
        expect(isNonNullObject('str')).to.be.false;
      });
      it('should return false for null', () => {
        expect(isNonNullObject(null)).to.be.false;
      });
      it('should return false for Object', () => {
        expect(isNonNullObject({})).to.be.true;
      });
      it('should return false for Array', () => {
        expect(isNonNullObject([])).to.be.true;
      });
    });
  });
})();
