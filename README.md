# dsteem-pool

Thin wrapper around [dsteem](https://github.com/jnordberg/dsteem) with identical API and automated fallback support

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
