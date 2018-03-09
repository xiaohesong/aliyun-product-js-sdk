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

- support http method
  - `get`
  - `post`
  - `put`
  - `delete`
  
  
  
- not work

  this package was work in my project. if not work for you, please open a issue. 
