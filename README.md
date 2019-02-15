# @rabota/loader
[![npm](https://img.shields.io/npm/dt/@rabota/loader.svg?style=flat-square)](https://www.npmjs.com/package/@rabota/loader)
[![npm (scoped with tag)](https://img.shields.io/npm/v/@rabota/loader/latest.svg?style=flat-square)](https://www.npmjs.com/package/@rabota/loader)

Loader with ability to cache & retry operations.

## Example

#### Script Loader
```js
const loader = new ScriptLoader();

loader.retry('https://example.com/script.js').then(_ => {
  // ...
});
```

#### Image loader
```js
const loader = new ImageLoader();

loader.retry('https://example.com/image.png').then(image => {
  // image loaded
});
```

#### Custom retry operation
```js
function action () {
  return new Promise((resolve, reject) => {
    setTimeout(_ => {
      reject( new Error('Cannot load content') );
    }, 1000 * Math.random());
  });
}

const loader = new RetryOperation();

loader.retry( action, 10 ).then(content => {
  // ...
}).catch(error => {
  // content cannot be loaded after 10 attempts
});
```

#### Retry operation with caching
```js
function action () {
  return new Promise(resolve => {
    setTimeout(_ => {
      resolve({
        content: 'some content'
      });
    }, 1000 * Math.random());
  });
}

// 100 is a max number of cache entities
// You can provide a LRU instance instead of number
const loader = new RetryOperationCached( 100 );

// `example_operation_cache_key` - is a key for caching success result
loader.retry( action, 10, 'example_operation_cache_key' ).then(result => {
  // `result` now is an object: { item: <your result>, cached: <true/false> }
}).catch(error => {
  // content cannot be loaded after 10 attempts
  // will not be cached
});
```

If you try to load content with same `cache key` you will get content from the cache.
