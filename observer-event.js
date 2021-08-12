export function Observer (data, name, context) {
  this.eventName = name || `mutilation-${+new Date()}`;
  this.data = data;
  this.context = context || window;
  
this.isArr = function(p) {
    return this.data[p].constructor == Array;
  }; // isArr
  
this.dispatch= function(p, v, t) {
    this.context.dispatchEvent(
      new CustomEvent(this.eventName, {
        bubbles: true,
detail: {
          prop: p,
          value: v,
          type: t
        } // event options
      }) // CustomEvent
    ); // listener
  }; // dispatch
} // Observer

Observer.prototype = {
  change: function(p, v) {
    this.data[p] = v;
    this.dispatch(p, v, "change");
  },
  
add: function(p, v) {
    this.isArr(p) ? this.data[p].push(v) : (this.data[p] = [this.data[p], v]);
    this.dispatch(p, v, "add");
  },
  
remove: function(p, v) {
    !this.isArr(p) ? delete this.data[p] : this.data[p].splice(v, 1);
    this.dispatch(p, p[v], "remove");
  },
  
subscribe: function(f, r) {
    this.context.addEventListener(this.eventName, e => {
      if (!r || r.some(p => e.detail.prop.indexOf(p) > -1)) {
        return f(e, this.data);
      } // if
    }); // listener
  } // subscribe
}; // Observer prototype

