(() => {
  'use strict';

  const {isNonEmptyString, isNonNullObject} = require('./utils');

  class StringTopicFilter {
    constructor(str) {
      if (!isNonEmptyString(str)) {
        throw new TypeError('str must be a non-empty string');
      }
      this._str = str;
    }

    isMatch(topic) {
      return this._str === topic;
    }

    toJSON() {
      return {
        type: 'string',
        data: this._str,
      };
    }
  }

  class RegexTopicFilter {
    constructor(re) {
      if (isNonEmptyString(re)) {
        re = new RegExp(re);
      }
      if (!(re instanceof RegExp)) {
        throw new TypeError('re must be a RegExp');
      }
      this._re = re;
    }

    isMatch(topic) {
      return this._re.test(topic);
    }

    toJSON() {
      return {
        type: 'regexp',
        data: this._str,
      };
    }
  }

  class TopicFilter {
    static fromTopic(topic) {
      if (!isNonNullObject(topic)) {
        throw new TypeError('topic must be a non-null object');
      }
      const {type, data} = topic;
      if ('string' === type) {
        return new StringTopicFilter(data);
      }
      if ('regexp' === type) {
        return new RegexTopicFilter(data);
      }
      throw new TypeError(`unknown topic type: ${type}`);
    }
  }

  module.exports = TopicFilter;
})();
