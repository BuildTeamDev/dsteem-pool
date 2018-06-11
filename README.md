# dsteem-pool [![Package Version](https://img.shields.io/npm/v/dsteem-pool.svg?style=flat-square)](https://www.npmjs.com/package/dsteem-pool)

Thin wrapper around [dsteem](https://github.com/jnordberg/dsteem) with identical API and automated fallback support

## Installation

```
npm i dsteem-pool --save
```

## Usage

original dsteem constructor:
```javascript
  const client = new Client('https://api.steemit.com');
```

dsteem-pool constructor:
```javascript
  const client = new Client([
    'https://api.badunresponsivedomain.com', //this will fail within 60 seconds
    'https://api.steemit.com'
  ]);
```

## license

MIT
