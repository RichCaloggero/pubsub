export function Observer (obj, name = "observed", context = document) {
  const observed = {};
  for (let prop in obj) {
    let ref = `m-${prop}`;
    observed[ref] = obj[prop];
    Object.defineProperty(observed, prop, {
      set: function(v) {
        this[ref] = v;
        context.dispatchEvent(
          new CustomEvent(`${name}:${prop}`, {
            bubbles: true,
detail: { prop: prop, value: v }
          }) // event options
        ); // event listener
      }, // set
      
get: function() {
        return this[ref];
      } // get
    }); // defineProperty
  } // for
  
return observed;
} // Observer
