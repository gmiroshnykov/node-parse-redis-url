var redis = require('redis');
var parseRedisUrl = require('./index')(redis);

var assert = require("assert")
describe('parse-redis-url', function() {
  it('should return default config on empty url', function() {
    var url = '';
    var expected = {
      host: 'localhost',
      port: 6379
    };
    var actual = parseRedisUrl.parse(url);
    assert.deepEqual(expected, actual);
  });

  it('should return default config when no host is specified', function() {
    var url = 'redis://';
    var expected = {
      host: 'localhost',
      port: 6379
    };
    var actual = parseRedisUrl.parse(url);
    assert.deepEqual(expected, actual);
  });

  it('should throw when protocol is not "redis://"', function() {
    var url = 'foobar://example.com';
    assert.throws(function() {
      parseRedisUrl.parse(url);
    }, /unsupported protocol/);
  });

  it('should parse host', function() {
    var url = 'redis://example.com';
    var expected = {
      host: 'example.com',
      port: 6379
    };
    var actual = parseRedisUrl.parse(url);
    assert.deepEqual(expected, actual);
  });

  it('should parse port', function() {
    var url = 'redis://example.com:5000';
    var expected = {
      host: 'example.com',
      port: 5000
    };
    var actual = parseRedisUrl.parse(url);
    assert.deepEqual(expected, actual);
  });

  it('should parse database', function() {
    var url = 'redis://example.com:5000/42';
    var expected = {
      host: 'example.com',
      port: 5000,
      database: 42
    };
    var actual = parseRedisUrl.parse(url);
    assert.deepEqual(expected, actual);
  });

  it('should parse password and discard username', function() {
    var url = 'redis://dummy:secret@example.com';
    var expected = {
      host: 'example.com',
      port: 6379,
      password: 'secret'
    };
    var actual = parseRedisUrl.parse(url);
    assert.deepEqual(expected, actual);
  });

  it('should omit trailing slash without database', function() {
    var url = 'redis://example.com:5000/';
    var expected = {
      host: 'example.com',
      port: 5000
    };
    var actual = parseRedisUrl.parse(url);
    assert.deepEqual(expected, actual);
  });

  it('should omit trailing slash with database', function() {
    var url = 'redis://example.com:5000/42/';
    var expected = {
      host: 'example.com',
      port: 5000,
      database: 42
    };
    var actual = parseRedisUrl.parse(url);
    assert.deepEqual(expected, actual);
  });

  it('should parse complex URLs', function() {
    var url = 'redis://dummy:secret@example.com:5000/42';
    var expected = {
      host: 'example.com',
      port: 5000,
      password: 'secret',
      database: 42
    };
    var actual = parseRedisUrl.parse(url);
    assert.deepEqual(expected, actual);
  });

  // TODO: tests for parseRedisUrl.createClient()
});
