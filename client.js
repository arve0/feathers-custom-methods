
export default function customMethodsClient (options = {}) {
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

      for (let methodName of methods[serviceName]) {
        service[methodName] = createWrapper(service, methodName)
      }
    }
  }
}

function createWrapper (service, name) {
  return function () {
    // JSON.stringify(arguments) does not yield an array, but rather an object:
    // { "0": value, "1": value2, ... }
    let args = Array.from(arguments)

    return service.create({
      method: name,
      arguments: args
    })
  }
}
