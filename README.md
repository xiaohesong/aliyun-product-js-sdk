- require

```shell
es6
```

- install

```shell
npm install aliyun-product-js-sdk
```

- useage

```es6
import Client from 'aliyun-product-js-sdk'

const client = new Client(key, secret);
client.post(url,{
  data: data,
  headers: {
    accept: 'application/json',
    'Content-Type': 'application/json; charset=UTF-8',
  }
})
```
