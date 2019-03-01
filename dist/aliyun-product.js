(function (global, factory) {
typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('url'), require('crypto'), require('uuid'), require('querystring')) :
typeof define === 'function' && define.amd ? define(['url', 'crypto', 'uuid', 'querystring'], factory) :
(global = global || self, global.AliyunOssProSdk = factory(global.url, global.crypto, global.uuid, global.querystring));
}(this, function (url, crypto, uuid, querystring) { 'use strict';

crypto = crypto && crypto.hasOwnProperty('default') ? crypto['default'] : crypto;
uuid = uuid && uuid.hasOwnProperty('default') ? uuid['default'] : uuid;
querystring = querystring && querystring.hasOwnProperty('default') ? querystring['default'] : querystring;

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }

  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}

function _asyncToGenerator(fn) {
  return function () {
    var self = this,
        args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);

      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }

      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }

      _next(undefined);
    });
  };
}

function _inheritsLoose(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype);
  subClass.prototype.constructor = subClass;
  subClass.__proto__ = superClass;
}

function loweredKeys(headers) {
  if (headers === void 0) {
    headers = {};
  }

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


var Base =
/*#__PURE__*/
function () {
  function Base() {}

  var _proto = Base.prototype;

  _proto.get = function get(url$1, opts) {
    if (opts === void 0) {
      opts = {};
    }

    var parsed = url.parse(url$1, true);
    var maybeQuery = opts.query || opts.data;

    if (maybeQuery) {
      // append data into querystring
      Object.assign(parsed.query, maybeQuery);
      parsed.path = parsed.pathname + '?' + querystring.stringify(parsed.query);
      opts.data = null;
      opts.query = null;
    } // lowerify the header key


    opts.headers = loweredKeys(opts.headers);
    opts.signHeaders = loweredKeys(opts.signHeaders);
    return this.request('GET', parsed, opts);
  };

  _proto.post = function post(url$1, opts) {
    if (opts === void 0) {
      opts = {};
    }

    var parsed = url.parse(url$1, true);
    var query = opts.query;

    if (query) {
      // append data into querystring
      Object.assign(parsed.query, query);
      parsed.path = parsed.pathname + '?' + querystring.stringify(parsed.query);
      opts.query = null;
    } // lowerify the header key


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
      opts.data = querystring.stringify(opts.data);
    } else if (type.startsWith('application/json')) {
      opts.data = JSON.stringify(opts.data);
    } else if (!Buffer.isBuffer(opts.data) && typeof opts.data !== 'string') {
      // 非buffer和字符串时，以JSON.stringify()序列化
      opts.data = JSON.stringify(opts.data);
    }

    return this.request('POST', parsed, opts, originData);
  };

  _proto.put = function put(url$1, opts) {
    if (opts === void 0) {
      opts = {};
    }

    var parsed = url.parse(url$1, true);
    var query = opts.query;

    if (query) {
      // append data into querystring
      Object.assign(parsed.query, query);
      parsed.path = parsed.pathname + '?' + querystring.stringify(parsed.query);
      opts.query = null;
    } // lowerify the header key


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
      opts.data = querystring.stringify(opts.data);
    } else if (type.startsWith('application/json')) {
      opts.data = JSON.stringify(opts.data);
    } else if (!Buffer.isBuffer(opts.data) && typeof opts.data !== 'string') {
      // 非buffer和字符串时，以JSON.stringify()序列化
      opts.data = JSON.stringify(opts.data);
    }

    return this.request('PUT', parsed, opts, originData);
  };

  _proto.delete = function _delete(url$1, opts) {
    var parsed = url.parse(url$1, true);
    var maybeQuery = opts.query || opts.data;

    if (maybeQuery) {
      // append data into querystring
      Object.assign(parsed.query, maybeQuery);
      parsed.path = parsed.pathname + '?' + querystring.stringify(parsed.query);
      opts.data = null;
      opts.query = null;
    } // lowerify the header key


    opts.headers = loweredKeys(opts.headers);
    opts.signHeaders = loweredKeys(opts.signHeaders);
    return this.request('DELETE', parsed, opts);
  };

  return Base;
}();

var form = 'application/x-www-form-urlencoded';

var hasOwnProperty = function hasOwnProperty(obj, key) {
  return Object.prototype.hasOwnProperty.call(obj, key);
};
/**
 * API Gateway Client
 */


var Client =
/*#__PURE__*/
function (_Base) {
  _inheritsLoose(Client, _Base);

  function Client(key, secret, stage) {
    var _this;

    if (stage === void 0) {
      stage = 'RELEASE';
    }

    _this = _Base.call(this) || this;
    _this.appKey = key;
    _this.appSecret = Buffer.from(secret, 'utf8');
    _this.stage = stage;
    return _this;
  }

  var _proto = Client.prototype;

  _proto.buildStringToSign = function buildStringToSign(method, headers, signedHeadersStr, url, data) {
    // accept, contentMD5, contentType,
    var lf = '\n';
    var list = [method, lf];
    var accept = headers['accept'];

    if (accept) {
      list.push(accept);
    }

    list.push(lf);
    var contentMD5 = headers['content-md5'];

    if (contentMD5) {
      list.push(contentMD5);
    }

    list.push(lf);
    var contentType = headers['content-type'] || '';

    if (contentType) {
      list.push(contentType);
    }

    list.push(lf);
    var date = headers['date'];

    if (date) {
      list.push(date);
    }

    list.push(lf);

    if (signedHeadersStr) {
      list.push(signedHeadersStr);
      list.push(lf);
    }

    if (contentType.startsWith(form)) {
      list.push(this.buildUrl(url, data));
    } else {
      list.push(this.buildUrl(url));
    }

    return list.join('');
  };

  _proto.sign = function sign(stringToSign) {
    return crypto.createHmac('sha256', this.appSecret).update(stringToSign, 'utf8').digest('base64');
  };

  _proto.md5 = function md5(content) {
    return crypto.createHash('md5').update(content, 'utf8').digest('base64');
  };

  _proto.getSignHeaderKeys = function getSignHeaderKeys(headers, signHeaders) {
    var keys = Object.keys(headers).sort();
    var signKeys = [];

    for (var i = 0; i < keys.length; i++) {
      var key = keys[i]; // x-ca- 开头的header或者指定的header

      if (key.startsWith('x-ca-') || hasOwnProperty(signHeaders, key)) {
        signKeys.push(key);
      }
    } // 按字典序排序


    return signKeys.sort();
  };

  _proto.buildUrl = function buildUrl(parsedUrl, data) {
    var toStringify = Object.assign(parsedUrl.query, data);
    var result = parsedUrl.pathname;

    if (Object.keys(toStringify).length) {
      var keys = Object.keys(toStringify).sort();
      var list = new Array(keys.length);

      for (var i = 0; i < keys.length; i++) {
        var key = keys[i];

        if (toStringify[key] && '' + toStringify[key]) {
          list[i] = key + "=" + toStringify[key];
        } else {
          list[i] = "" + key;
        }
      }

      result += '?' + list.join('&');
    }

    return result;
  };

  _proto.buildHeaders = function buildHeaders(headers, signHeaders) {
    if (headers === void 0) {
      headers = {};
    }

    return Object.assign({
      'x-ca-timestamp': Date.now(),
      'x-ca-key': this.appKey,
      'x-ca-nonce': uuid.v4(),
      'x-ca-stage': this.stage,
      'accept': 'application/json'
    }, headers, signHeaders);
  };

  _proto.getSignedHeadersString = function getSignedHeadersString(signHeaders, headers) {
    var list = [];

    for (var i = 0; i < signHeaders.length; i++) {
      var key = signHeaders[i];
      list.push(key + ':' + headers[key]);
    }

    return list.join('\n');
  };

  _proto.request =
  /*#__PURE__*/
  function () {
    var _request = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee(method, url$1, opts, originData) {
      var signHeaders, headers, requestContentType, signHeaderKeys, signedHeadersStr, parsedUrl, stringToSign, myRequest, requestPromise, result;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              signHeaders = opts.signHeaders; // 小写化，合并之后的headers

              headers = this.buildHeaders(opts.headers, signHeaders);
              requestContentType = headers['content-type'] || '';

              if (method === 'POST' && !requestContentType.startsWith(form)) {
                headers['content-md5'] = this.md5(opts.data);
              }

              signHeaderKeys = this.getSignHeaderKeys(headers, signHeaders);
              headers['x-ca-signature-headers'] = signHeaderKeys.join(',');
              signedHeadersStr = this.getSignedHeadersString(signHeaderKeys, headers);
              parsedUrl = url.parse(url$1, true);
              stringToSign = this.buildStringToSign(method, headers, signedHeadersStr, parsedUrl, originData);
              headers['x-ca-signature'] = this.sign(stringToSign);
              myRequest = new Request(parsedUrl.href, {
                method: method,
                body: opts.data,
                headers: headers
              });
              requestPromise = new Promise(function (resolve, reject) {
                fetch(myRequest).then(function (res) {
                  if (res.status !== 200) {
                    var errors = res.status + ", " + res.statusText;
                    throw errors;
                  } else {
                    return res.json();
                  }
                }).then(function (data) {
                  return resolve(data);
                }).catch(function (error) {
                  return reject(error);
                });
              });
              _context.next = 14;
              return requestPromise.then(function (response) {
                return response;
              });

            case 14:
              result = _context.sent;
              return _context.abrupt("return", result);

            case 16:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, this);
    }));

    function request(_x, _x2, _x3, _x4) {
      return _request.apply(this, arguments);
    }

    return request;
  }();

  return Client;
}(Base);

return Client;

}));
