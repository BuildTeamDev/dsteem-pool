# dhive-pool [![Package Version](https://img.shields.io/npm/v/dhive-pool.svg?style=flat-square)](https://www.npmjs.com/package/dhive-pool)

Thin wrapper around [dhive](https://gitlab.syncad.com/hive/dhive) with identical API and automated fallback support

## Installation

```
npm i dhive-pool --save
```

## Usage

original dhive constructor:
```javascript
  const client = new Client('https://api.hive.blog');
```

dhive-pool constructor:
```javascript
  const client = new Client([
    'https://api.badunresponsivedomain.com', //this will fail within 60 seconds
    'https://api.hive.blog'
  ]);
```

## license

MIT
