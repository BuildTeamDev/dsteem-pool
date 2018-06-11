import { Client as OriginalClient } from 'dsteem';

let pool = [];
let capture = function capture(obj) {
  const client = pool[0];
  const handler = {
    get(target, propKey, receiver) {
      const targetValue = Reflect.get(client, propKey, receiver);
      if (typeof targetValue === 'function') {
        return function (...args) {
          return targetValue.apply(client, args);
        }
      } else {
        return targetValue;
      }
    }
  }
  return new Proxy(obj, handler);
}

let resolve = function resolve(obj, path) {
  return path.split('.').reduce(function(prev, curr) {
      return prev ? prev[curr] : undefined
  }, obj || self)
}

export class Client {

  constructor(url) {
    if(Array.isArray(url)) {
      pool = url.map((u, i) => this.wrap(new OriginalClient(u), i));
      return capture(this);
    } else {
      return new OriginalClient(url);
    }
  }

  wrap (obj, index, path) {
    if(!path) path = [];
    const self = this;
    const handler = {
      get(target, propKey, receiver) {
        const targetValue = Reflect.get(target, propKey, receiver);
        if (typeof targetValue === 'function') {
          return function (...args) {
            return targetValue.apply(target, args).catch((e) => {
              if(['request-timeout'].indexOf(e.type) != -1) {
                const next = pool[index + 1];
                if(next) {
                  return resolve(next, path.join('.'))[propKey].apply(next, arguments);
                } else {
                  throw e;
                }
              }
            });
          }
        } else {
          path.push(propKey);
          return self.wrap(targetValue, index, path);
        }
      }
    };
    if(typeof(obj) === 'object') {
      return new Proxy(obj, handler);
    }
  }
};
