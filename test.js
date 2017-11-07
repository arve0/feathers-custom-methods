const feathers = require('feathers')
const bodyParser = require('body-parser')
const rest = require('feathers-rest')
const hooks = require('feathers-hooks')
const customMethods = require('./')
const open = require('open')

const emailService = {
  create () {},
  send (address, phone) {
    // everything OK if called with send('test@me.com', 1234) from client
    if (address === 'test@me.com' && phone === 1234) {
      setTimeout(() => {
        console.log('test OK')
        process.exit(0)
      }, 10)
      return Promise.resolve('test OK')
    }
    // fail
    setTimeout(() => {
      console.log('test FAILED')
      console.log(`send was called with ${Array.from(arguments).join(', ')}`)
      console.log(`expected test@me.com, 1234`)
      process.exit(1)
    }, 10)
    return Promise.reject(new Error('test FAILED'))
  },
  setup (app, path) {}
}

const app = feathers()
app.use(bodyParser.json())
app.configure(rest())
app.configure(hooks())

app.use('/email', emailService)

app.configure(customMethods({
  methods: {
    email: ['send']
  }
}))

app.use('/', feathers.static('.'))

app.listen(3030, function () {
  console.log('Listening on port 3030')
  console.log('opening http://localhost:3030 in browser')
  open('http://localhost:3030')
})
