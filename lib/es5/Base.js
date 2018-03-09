'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _url = require('url');

var _querystring = require('querystring');

var _querystring2 = _interopRequireDefault(_querystring);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function loweredKeys() {
  var headers = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var lowered = {};

  var keys = Object.keys(headers);
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    lowered[key.toLowerCase()] = headers[key];
  }

  return lowered;
}

/**
 * API Gateway Client
 */

var Base = function () {
  function Base() {
    _classCallCheck(this, Base);
  }

  _createClass(Base, [{
    key: 'get',
    value: function get(url) {
      var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      var parsed = (0, _url.parse)(url, true);
      var maybeQuery = opts.query || opts.data;
      if (maybeQuery) {
        // append data into querystring
        Object.assign(parsed.query, maybeQuery);
        parsed.path = parsed.pathname + '?' + _querystring2.default.stringify(parsed.query);
        opts.data = null;
        opts.query = null;
      }

      // lowerify the header key
      opts.headers = loweredKeys(opts.headers);
      opts.signHeaders = loweredKeys(opts.signHeaders);

      return this.request('GET', parsed, opts);
    }
  }, {
    key: 'post',
    value: function post(url) {
      var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      var parsed = (0, _url.parse)(url, true);
      var query = opts.query;
      if (query) {
        // append data into querystring
        Object.assign(parsed.query, query);
        parsed.path = parsed.pathname + '?' + _querystring2.default.stringify(parsed.query);
        opts.query = null;
      }

      // lowerify the header key
      opts.headers = loweredKeys(opts.headers);
      opts.signHeaders = loweredKeys(opts.signHeaders);

      var headers = opts.headers;
      var type = headers['content-type'] || headers['Content-Type'];
      if (!type) {
        headers['content-type'] = 'application/json';
        type = headers['content-type'];
      }

      var originData = opts.data;
      if (type.startsWith('application/x-www-form-urlencoded')) {
        opts.data = _querystring2.default.stringify(opts.data);
      } else if (type.startsWith('application/json')) {
        opts.data = JSON.stringify(opts.data);
      } else if (!Buffer.isBuffer(opts.data) && typeof opts.data !== 'string') {
        // 非buffer和字符串时，以JSON.stringify()序列化
        opts.data = JSON.stringify(opts.data);
      }

      return this.request('POST', parsed, opts, originData);
    }
  }, {
    key: 'put',
    value: function put(url) {
      var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      var parsed = (0, _url.parse)(url, true);
      var query = opts.query;
      if (query) {
        // append data into querystring
        Object.assign(parsed.query, query);
        parsed.path = parsed.pathname + '?' + _querystring2.default.stringify(parsed.query);
        opts.query = null;
      }

      // lowerify the header key
      opts.headers = loweredKeys(opts.headers);
      opts.signHeaders = loweredKeys(opts.signHeaders);

      var headers = opts.headers;
      var type = headers['content-type'] || headers['Content-Type'];
      if (!type) {
        headers['content-type'] = 'application/json';
        type = headers['content-type'];
      }

      var originData = opts.data;
      if (type.startsWith('application/x-www-form-urlencoded')) {
        opts.data = _querystring2.default.stringify(opts.data);
      } else if (type.startsWith('application/json')) {
        opts.data = JSON.stringify(opts.data);
      } else if (!Buffer.isBuffer(opts.data) && typeof opts.data !== 'string') {
        // 非buffer和字符串时，以JSON.stringify()序列化
        opts.data = JSON.stringify(opts.data);
      }

      return this.request('PUT', parsed, opts, originData);
    }
  }, {
    key: 'delete',
    value: function _delete(url, opts) {
      var parsed = (0, _url.parse)(url, true);
      var maybeQuery = opts.query || opts.data;
      if (maybeQuery) {
        // append data into querystring
        Object.assign(parsed.query, maybeQuery);
        parsed.path = parsed.pathname + '?' + _querystring2.default.stringify(parsed.query);
        opts.data = null;
        opts.query = null;
      }

      // lowerify the header key
      opts.headers = loweredKeys(opts.headers);
      opts.signHeaders = loweredKeys(opts.signHeaders);

      return this.request('DELETE', parsed, opts);
    }
  }]);

  return Base;
}();

exports.default = Base;
