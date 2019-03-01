(function (global, factory) {
typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('url'), require('crypto'), require('uuid'), require('querystring')) :
typeof define === 'function' && define.amd ? define(['url', 'crypto', 'uuid', 'querystring'], factory) :
(global = global || self, global.AliyunOssProSdk = factory(global.url, global.crypto, global.uuid, global.querystring));
}(this, function (url, crypto, uuid, querystring) { 'use strict';

crypto = crypto && crypto.hasOwnProperty('default') ? crypto['default'] : crypto;
uuid = uuid && uuid.hasOwnProperty('default') ? uuid['default'] : uuid;
querystring = querystring && querystring.hasOwnProperty('default') ? querystring['default'] : querystring;

function loweredKeys(headers = {}) {
  let lowered = {};
  let keys = Object.keys(headers);

  for (let i = 0; i < keys.length; i++) {
    let key = keys[i];
    lowered[key.toLowerCase()] = headers[key];
  }

  return lowered;
}
/**
 * API Gateway Client
 */


class Base {
  get(url$1, opts = {}) {
    let parsed = url.parse(url$1, true);
    let maybeQuery = opts.query || opts.data;

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
  }

  post(url$1, opts = {}) {
    let parsed = url.parse(url$1, true);
    let query = opts.query;

    if (query) {
      // append data into querystring
      Object.assign(parsed.query, query);
      parsed.path = parsed.pathname + '?' + querystring.stringify(parsed.query);
      opts.query = null;
    } // lowerify the header key


    opts.headers = loweredKeys(opts.headers);
    opts.signHeaders = loweredKeys(opts.signHeaders);
    let headers = opts.headers;
    let type = headers['content-type'] || headers['Content-Type'];

    if (!type) {
      headers['content-type'] = 'application/json';
      type = headers['content-type'];
    }

    let originData = opts.data;

    if (type.startsWith('application/x-www-form-urlencoded')) {
      opts.data = querystring.stringify(opts.data);
    } else if (type.startsWith('application/json')) {
      opts.data = JSON.stringify(opts.data);
    } else if (!Buffer.isBuffer(opts.data) && typeof opts.data !== 'string') {
      // 非buffer和字符串时，以JSON.stringify()序列化
      opts.data = JSON.stringify(opts.data);
    }

    return this.request('POST', parsed, opts, originData);
  }

  put(url$1, opts = {}) {
    let parsed = url.parse(url$1, true);
    let query = opts.query;

    if (query) {
      // append data into querystring
      Object.assign(parsed.query, query);
      parsed.path = parsed.pathname + '?' + querystring.stringify(parsed.query);
      opts.query = null;
    } // lowerify the header key


    opts.headers = loweredKeys(opts.headers);
    opts.signHeaders = loweredKeys(opts.signHeaders);
    let headers = opts.headers;
    let type = headers['content-type'] || headers['Content-Type'];

    if (!type) {
      headers['content-type'] = 'application/json';
      type = headers['content-type'];
    }

    let originData = opts.data;

    if (type.startsWith('application/x-www-form-urlencoded')) {
      opts.data = querystring.stringify(opts.data);
    } else if (type.startsWith('application/json')) {
      opts.data = JSON.stringify(opts.data);
    } else if (!Buffer.isBuffer(opts.data) && typeof opts.data !== 'string') {
      // 非buffer和字符串时，以JSON.stringify()序列化
      opts.data = JSON.stringify(opts.data);
    }

    return this.request('PUT', parsed, opts, originData);
  }

  delete(url$1, opts) {
    let parsed = url.parse(url$1, true);
    let maybeQuery = opts.query || opts.data;

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
  }

}

const form = 'application/x-www-form-urlencoded';

const hasOwnProperty = function (obj, key) {
  return Object.prototype.hasOwnProperty.call(obj, key);
};
/**
 * API Gateway Client
 */


class Client extends Base {
  constructor(key, secret, stage = 'RELEASE') {
    super();
    this.appKey = key;
    this.appSecret = Buffer.from(secret, 'utf8');
    this.stage = stage;
  }

  buildStringToSign(method, headers, signedHeadersStr, url, data) {
    // accept, contentMD5, contentType,
    const lf = '\n';
    let list = [method, lf];
    let accept = headers['accept'];

    if (accept) {
      list.push(accept);
    }

    list.push(lf);
    let contentMD5 = headers['content-md5'];

    if (contentMD5) {
      list.push(contentMD5);
    }

    list.push(lf);
    let contentType = headers['content-type'] || '';

    if (contentType) {
      list.push(contentType);
    }

    list.push(lf);
    let date = headers['date'];

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
  }

  sign(stringToSign) {
    return crypto.createHmac('sha256', this.appSecret).update(stringToSign, 'utf8').digest('base64');
  }

  md5(content) {
    return crypto.createHash('md5').update(content, 'utf8').digest('base64');
  }

  getSignHeaderKeys(headers, signHeaders) {
    let keys = Object.keys(headers).sort();
    let signKeys = [];

    for (let i = 0; i < keys.length; i++) {
      let key = keys[i]; // x-ca- 开头的header或者指定的header

      if (key.startsWith('x-ca-') || hasOwnProperty(signHeaders, key)) {
        signKeys.push(key);
      }
    } // 按字典序排序


    return signKeys.sort();
  }

  buildUrl(parsedUrl, data) {
    let toStringify = Object.assign(parsedUrl.query, data);
    let result = parsedUrl.pathname;

    if (Object.keys(toStringify).length) {
      let keys = Object.keys(toStringify).sort();
      let list = new Array(keys.length);

      for (let i = 0; i < keys.length; i++) {
        let key = keys[i];

        if (toStringify[key] && '' + toStringify[key]) {
          list[i] = `${key}=${toStringify[key]}`;
        } else {
          list[i] = `${key}`;
        }
      }

      result += '?' + list.join('&');
    }

    return result;
  }

  buildHeaders(headers = {}, signHeaders) {
    return Object.assign({
      'x-ca-timestamp': Date.now(),
      'x-ca-key': this.appKey,
      'x-ca-nonce': uuid.v4(),
      'x-ca-stage': this.stage,
      'accept': 'application/json'
    }, headers, signHeaders);
  }

  getSignedHeadersString(signHeaders, headers) {
    let list = [];

    for (let i = 0; i < signHeaders.length; i++) {
      let key = signHeaders[i];
      list.push(key + ':' + headers[key]);
    }

    return list.join('\n');
  }

  async request(method, url$1, opts, originData) {
    let signHeaders = opts.signHeaders; // 小写化，合并之后的headers

    let headers = this.buildHeaders(opts.headers, signHeaders);
    let requestContentType = headers['content-type'] || '';

    if (method === 'POST' && !requestContentType.startsWith(form)) {
      headers['content-md5'] = this.md5(opts.data);
    }

    let signHeaderKeys = this.getSignHeaderKeys(headers, signHeaders);
    headers['x-ca-signature-headers'] = signHeaderKeys.join(',');
    let signedHeadersStr = this.getSignedHeadersString(signHeaderKeys, headers);
    let parsedUrl = url.parse(url$1, true);
    let stringToSign = this.buildStringToSign(method, headers, signedHeadersStr, parsedUrl, originData);
    headers['x-ca-signature'] = this.sign(stringToSign);
    const myRequest = new Request(parsedUrl.href, {
      method: method,
      body: opts.data,
      headers: headers
    });
    const requestPromise = new Promise((resolve, reject) => {
      fetch(myRequest).then(res => {
        if (res.status !== 200) {
          let errors = `${res.status}, ${res.statusText}`;
          throw errors;
        } else {
          return res.json();
        }
      }).then(data => resolve(data)).catch(error => reject(error));
    });
    const result = await requestPromise.then(response => response);
    return result;
  }

}

return Client;

}));
