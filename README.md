# node-bits-autodiscovery
A BITS library to facilitate auto discovery of resources. A BITS module can have hard dependencies (the consumer module explicitly calls out in the consumed module in the consumer's `module.json`) or soft dependencies (the consumer module uses `LazyLoad` to be notified when the consumed module loads). In either case the consumer module must know the consumed module's name and API classes.

Auto discovery protocol can be used to de-couple the explicit knowledge of a consumer modules from consumed modules. The protocol uses events to notify when resources become available and unavailable. The `ResourceManager` can be used to get a list of currently available resources and listen for when resources become available and unavailable. The `Resource` class can be used to notify the system a resource is available.

## How to use a `Resource`
``` javascript
const {Resource} = require('@bits/bits-auto-discovery');

class ModuleApp {
  constructor() {
    this._resource = new Resource({
      topic: 'numbers',
      name: 'Random Integers',
      data: {
        getRequest: 'my-app#Get',
        updateEvent: 'my-app#Update'
      },
    });
  }

  load(messageCenter) {
    return Promise.resolve()
      .then(() => this._resource.load(messageCenter));
  }

  unload() {
    return Promise.resolve()
      .then(() => this._resource.unload());
  }
}

module.exports = new ModuleApp();
```
