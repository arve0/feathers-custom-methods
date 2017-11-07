module.exports = function customMethodsServer (options = {}) {
  let methods = options.methods
  if (!methods) {
    throw new Error('should be called with an object containing `methods: { serviceName: ["methodName"] }`')
  }

  return function () {
    for (let serviceName in methods) {
      let service = this.service(serviceName)

      if (!service) {
        throw new Error(`service ${serviceName} not found`)
      }

      if (!service.hooks) {
        throw new Error('you need to add hooks to use feathers-custom-methods: app.configure(require("feathers-hooks")())')
      }

      for (let methodName of methods[serviceName]) {
        service.hooks({
          before: {
            create: createWrapper(service, methodName)
          }
        })
      }
    }
  }
}

function createWrapper (service, name) {
  return function (hook) {
    if (!hook.data || !hook.data.method || hook.data.method !== name) {
      return
    }

    // convert from { "0": "asdf", "1": 123 } to ["asdf", 123]
    const args = toArray(hook.data.arguments)

    return service[name].apply(service, args)
      .then(result => {
        hook.result = result
        return hook
      }) // do not catch, let errors propagate
  }
}

function toArray (args) {
  return Object.keys(args)
    .map(k => parseInt(k))
    .sort()
    .map(k => args[k])
}
