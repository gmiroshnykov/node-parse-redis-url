parse-redis-url
===============

A module for parsing `redis://..` URLs into
[node_redis](https://github.com/mranney/node_redis)-friendly options.

Can also create actual client instance for your convenience.

[![Build Status](https://travis-ci.org/laggyluke/node-parse-redis-url.png?branch=master)](https://travis-ci.org/laggyluke/node-parse-redis-url)

Usage
-----

```javascript
var redis = require('redis');
var parseRedisUrl = require('parse-redis-url')(redis);
var url = 'redis://dummy:password@example.com:5555/42';

// create a new client from URL

parseRedisUrl.createClient(url, function(err, client) {
   if (err) return callback(err);
   // do something with client
});



// simply parse URL for connection options
// please note that username is not used by Redis,
// so it's not included in the result

var options = parseRedisUrl.parse(url);
// { host: 'example.com',
//  port: 5555,
//  password: 'password',
//  database: 42 }

```
