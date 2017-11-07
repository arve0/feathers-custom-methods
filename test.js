const feathers = require('feathers')
const bodyParser = require('body-parser')
const rest = require('feathers-rest')
const hooks = require('feathers-hooks')
const customMethods = require('./')
const open = require('open')
const assert = require('assert')

const expectedArgs = [
  'test@me.com',
  1234,
  [true, null]
]

const emailService = {
  create () {},
  send () {
    // everything OK if called with expectedArgs
    try {
      let args = Array.from(arguments)
      assert.deepEqual(args, expectedArgs)
    } catch (err) {
      console.error(`Test failed with ${err.message}.`)
      setTimeout(() => process.exit(1), 10)  // make sure failed request is sent back to client
      return Promise.reject(new Error(`Test failed with ${err.message}.`))
    }
    console.log('Test OK.')
    setTimeout(() => process.exit(0), 10)
    return Promise.resolve('Test OK.')
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
