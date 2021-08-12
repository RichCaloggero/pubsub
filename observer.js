const observers = new Map();

/// test
const myObject = {
a:1,
get b () {return this._b;},
set b (v) {
this._b = v;
console.log(`myObject setter: set b to ${v}`);
} // set b
}; // myObject
 publish(myObject, "b");
subscribe(myObject, "b", (object, p, v) =>
console.log(`${p}: ${v}`)
); // subscribe
myObject.b = 77;

function publish (object, property) {
console.debug ("publish: ", object, property);
const properties = observers.has(object)? observers.get(object)
: (observers.set(object, new Map()), observers.get(object));
console.debug("publish: properties: ", properties);

const subscribers = properties.has(property)? properties.get(property)
: (properties.set(property, new Map()), properties.get(property));
console.debug("publish: subscribers: ", subscribers);

if (!subscribers.has(property)) {
subscribers.set(property, {lastValue: null, callbacks: []});
console.debug("publishing: ", subscribers);

if (object instanceof HTMLElement) {
object.addEventListener("change", e => _set(e.target.value));
} else {
const getter = object.__lookupGetter__(property);
const setter = object.__lookupSetter__(property);

Object.defineProperty(object, property, {
set: function (value) {
if (setter instanceof Function) setter(value);
_set(value);
}, // set

get: function () {
const result = _get();
if (getter instanceof Function) getter();
return result;
}, // get
}); // defineProperty
} // if
} // if

return property;

function _set (value) {
console.debug("setting ", property, " of ", object, " to ", value);
const subscriptions = subscribers.get(property);
if (value !== subscriptions.lastValue) {
subscriptions.lastValue = value;
notify(subscriptions.callbacks, object, property, value);
} // if
} // _set

function _get () {return subscribers.get(property).lastValue;}

} // publish


function subscribe (object, property, callback) {
if (observers.has(object)) {
const properties = observers.get(object);
if (properties.has(property)) {
const subscribers = properties.get(property);
const subscriptions = subscribers.get(property);

Object.assign(
subscriptions,
{callbacks: [...subscriptions.callbacks, callback]}
); // assign
} // if
} // if
} // subscribe

function notify (callbacks, object, property, value) {
callbacks.forEach(f => f(object, property, value));
} // notify
