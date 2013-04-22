var url = require('url');

var DEFAULT_HOST = 'localhost';
var DEFAULT_PORT = 6379;

module.exports = function(redisModule) {
  return new ParseRedisUrl(redisModule);
};

function ParseRedisUrl(module) {
  this.module = module;
}

ParseRedisUrl.prototype.parse = function(redisUrl) {
  var options = {
    host: DEFAULT_HOST,
    port: DEFAULT_PORT
  };

  if (!redisUrl) {
    return options;
  }

  var parts = url.parse(redisUrl);
  if (!parts) {
    return options;
  }

  if (parts.protocol != 'redis:') {
    throw new Error('unsupported protocol: ' + parts.protocol);
  }

  if (parts.hostname) {
    options.host = parts.hostname;
  }

  if (parts.port) {
    options.port = parseInt(parts.port, 10);
  }

  if (parts.auth) {
    options.password = parts.auth.substr(parts.auth.indexOf(':') + 1);
  }

  if (parts.path && parts.path.length > 1) {
    options.database = parseInt(parts.path.substr(1), 10);
  }

  return options;
};

ParseRedisUrl.prototype.createClient = function(redisUrl, callback) {
  var options = this.parse(redisUrl);
  var redisClient = this.module.createClient(options.port, options.host);
  return authenticate(redisClient, options, callback);
};

function authenticate(redisClient, options, callback) {
  if (options.password) {
    redisClient.auth(options.password, function(err) {
      if (err) return callback(err);
      return selectDatabase(redisClient, options, callback);
    });
  } else {
    return selectDatabase(redisClient, options, callback);
  }
}

function selectDatabase(redisClient, options, callback) {
  if (options.database) {
    redisClient.select(options.database, function(err) {
      if (err) return callback(err);
      return callback(null, redisClient);
    });
  } else {
    return callback(null, redisClient);
  }
}
