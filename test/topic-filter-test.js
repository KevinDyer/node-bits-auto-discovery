(() => {
  'use strict';

  const chai = require('chai');
  const {TopicFilter, StringTopicFilter, RegexTopicFilter} = require('./../src/topic-filter');
  const {isNonNullObject, isNonEmptyString} = require('./../src/utils');

  const expect = chai.expect;

  describe('TopicFilter', () => {
    describe('newTopicFilter', () => {
      it('should should create string topic filter from a string', () => {
        const topicFilter = TopicFilter.newTopicFilter('test');
        expect(topicFilter instanceof StringTopicFilter).to.be.true;
      });
      it('should should create regex topic filter from a string', () => {
        const topicFilter = TopicFilter.newTopicFilter(/test/);
        expect(topicFilter instanceof RegexTopicFilter).to.be.true;
      });
      it('should throw TypeError is not a non-empty string or RegExp', () => {
        function createTopicFilter(topic) {
          return function() {
            TopicFilter.newTopicFilter(topic);
          };
        }
        expect(createTopicFilter(42)).to.throw(TypeError);
      });
    });
    describe('fromJSON', () => {
      it('should return an object', () => {
        const topicFilter = TopicFilter.newTopicFilter('test');
        const topicFilterJSON = topicFilter.toJSON();
        expect(isNonNullObject(topicFilterJSON)).to.be.true;
        const {type, data} = topicFilterJSON;
        expect(isNonEmptyString(type)).to.be.true;
        expect(isNonEmptyString(data)).to.be.true;
      });
    });
  });
})();
