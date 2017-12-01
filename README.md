# node-bits-autoload
A BITS library to help auto discovery capabilities. A BITS module can have hard
dependencies (the consumer module explicitly calls out in the consumed module
in the consumer's `module.json`) or soft dependencies (the consumer module uses
`LazyLoad` to be notified when the consumed module loads). In either case the
consumer module must know the consumed module's name and API classes.

AutoDiscovery protocol can be used to de-couple the explicit knowledge of a consumer modules from consumed modules. The protocol has to components; `resource`s and `consumer`s. A `resource` sends an add event to the system when loaded to alert any `consumer` already loaded on the system. A `consumer` sends a query event to the system when loaded. Any `resource` that is currently loaded


``` javascript
'use strict';

const Messenger = global.helper.Messenger;
const {Resource} = require('bits-auto-discovery');

const messenger = new Messenger();
messeger.addRequestListener('random#Get', null, (metadata, {min=0, max=100}) => Promise.resolve(Math.floor(Math.random() * (max - min)) + min));

const resource = new Resource({
  topic: 'numbers',
  name: 'Random Integers',
  request: 'random#Get'
});


module.exports = {

  load(messageCenter) {
    return Promise.resolve();
  }

  unload() {
    return Promise.resolve();
  }
}

```
