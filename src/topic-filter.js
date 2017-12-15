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
        type: StringTopicFilter.TYPE,
        data: this._str,
      };
    }

    static get TYPE() {
      return 'string';
    }
  }
  module.exports.StringTopicFilter = StringTopicFilter;

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
        type: RegexTopicFilter.TYPE,
        data: this._re.source,
      };
    }

    static get TYPE() {
      return 'regex';
    }
  }
  module.exports.RegexTopicFilter = RegexTopicFilter;

  class TopicFilter {
    static newTopicFilter(topic) {
      if (isNonEmptyString(topic)) {
        return new StringTopicFilter(topic);
      }
      if (topic instanceof RegExp) {
        return new RegexTopicFilter(topic);
      }
      throw new TypeError(`topic must be a non-empty string or RegExp`);
    }

    static fromJSON(topic) {
      if (!isNonNullObject(topic)) {
        throw new TypeError('topic must be a non-null object');
      }
      const {type, data} = topic;
      if (StringTopicFilter.TYPE === type) {
        return new StringTopicFilter(data);
      }
      if (RegexTopicFilter.TYPE === type) {
        return new RegexTopicFilter(data);
      }
      throw new TypeError(`Unknown topic type: ${type}`);
    }
  }

  module.exports.TopicFilter = TopicFilter;
})();
