import urlParse from 'url'
import crypto from 'crypto'
import uuid from 'uuid'

import Base from './Base'

const parse = urlParse.parse
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
    return crypto.createHmac('sha256', this.appSecret)
      .update(stringToSign, 'utf8').digest('base64');
  }

  md5(content) {
    return crypto.createHash('md5')
      .update(content, 'utf8')
      .digest('base64');
  }

  getSignHeaderKeys(headers, signHeaders) {
    let keys = Object.keys(headers).sort();
    let signKeys = [];
    for (let i = 0; i < keys.length; i++) {
      let key = keys[i];
      // x-ca- 开头的header或者指定的header
      if (key.startsWith('x-ca-') || hasOwnProperty(signHeaders, key)) {
        signKeys.push(key);
      }
    }

    // 按字典序排序
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
        if (toStringify[key] && ('' + toStringify[key])) {
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

  async request(method, url, opts, originData) {
    let signHeaders = opts.signHeaders;
    // 小写化，合并之后的headers
    let headers = this.buildHeaders(opts.headers, signHeaders);

    let requestContentType = headers['content-type'] || '';
    if (method === 'POST' && !requestContentType.startsWith(form)) {
      headers['content-md5'] = this.md5(opts.data);
    }

    let signHeaderKeys = this.getSignHeaderKeys(headers, signHeaders);
    headers['x-ca-signature-headers'] = signHeaderKeys.join(',');
    let signedHeadersStr = this.getSignedHeadersString(signHeaderKeys, headers);

    let parsedUrl = parse(url, true);
    let stringToSign = this.buildStringToSign(method, headers, signedHeadersStr, parsedUrl, originData);
    headers['x-ca-signature'] = this.sign(stringToSign);

    const myRequest = new Request(parsedUrl.href, {
      method: method,
      body: opts.data,
      headers: headers,
    });
    const requestPromise = new Promise((resolve, reject) => {
      fetch(myRequest).then(res => {
        if(res.status !== 200){
          let errors = `${res.status}, ${res.statusText}`
          throw errors
        }else{
          return res.json()
        }
      })
      .then(data => resolve(data))
      .catch(error => reject(error))
    })

    const result = await requestPromise.then(response => response)
    return result
  }
}

export default Client
