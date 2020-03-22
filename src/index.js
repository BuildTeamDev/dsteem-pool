import { Client as OriginalClient, PrivateKey, Price, Asset } from 'hiveapitest';

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

class Client {

  constructor(url, opts) {
    if(Array.isArray(url)) {
      pool = url.map((u, i) => this.wrap(new OriginalClient(u, opts), i));
      return capture(this);
    } else {
      return new OriginalClient(url, opts);
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
            const fn = targetValue.apply(target, args);
            if(fn.catch) {
              return fn.catch((e) => {
                if(['request-timeout'].indexOf(e.type) != -1 || ['ENOTFOUND', 'ECONNREFUSED'].indexOf(e.code) != -1) {
                  const next = pool[index + 1];
                  if(next) {
                    console.log(`${e.message}, skipping`);
                    return resolve(next, path.join('.'))[propKey].apply(next, arguments);
                  } else {
                    throw e;
                  }
                } else {
                  if(e.type || e.code) console.error(`Error of type ${e.type}/${e.code} is not handled by dsteem-pool`, e.message);
                  throw e;
                }
              });
            } else {
              return fn;
            }
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

export {
  Client,
  PrivateKey,
  Price,
  Asset
};
