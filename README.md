# feathers-custom-methods
Add custom methods to your services. For example:

```js
emailService.send(address, subject, content)
```

## Install
```
npm i feathers-custom-methods
```

## Usage
Server side, configure the plugin and implement the method:

```js
const customMethods = require('feathers-custom-methods')

app.configure(customMethods({
  methods: {
    email: ['send']  // allow calling app.service('email').send client side
  }
}))

app.service('email').send = function (address, subject, content) {
  // implement the method

  // or implement it through a custom service:
  // const emailService = {
  //   send(address, subject, content) { /* implementation */ }
  // }
  // app.use('/email', emailService)
}
```

Client side, configure the client plugin:

```js
import customMethods from 'feathers-custom-methods/client'

app.configure(customMethods({
  methods: {
    email: ['send']
  }
}))
```

Now you can use `send` as a method on the `email` service client side:

```js
app.service('email').send(address, subject, content)
  .then(response => {
    // handle response
  }).catch(err => {
    // handle error
  })
```

The code above will call `app.service('email').send` server side with the same arguments.

## HTTP requests
feathers-custom-methods uses the [create](https://docs.feathersjs.com/api/services.html#createdata-params) method to send data from client to server. In other words, the call `service.send(arg1, arg2)` is equivalent to:

```js
service.create({
  method: 'send',
  arguments: [arg1, arg2]
})
```

Which means that you can call custom methods through HTTP requests like this:

```
curl -X POST -H "Content-Type:application/json" -d '{ "method": "send", "arguments": ["name@domain.com", "subject", "content"] }' http://localhost:3030/email
```

## Development
```
npm test # will start node test.js
```

The test will open in a browser window. When the test ends, you must navigate back to the terminal. For more information, see [test.js](test.js) and [index.html](index.html).

## License
MIT
