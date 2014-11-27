
var fs = require('fs');
var jadeV = require('require-cwd')('jade-virtualdom');

var crypto = require('crypto');

var cache = Object.create(null);

exports = module.exports = function (options) {
  options = options || {};

  return function jade(file, done) {
    if (file.extension !== 'jade') return done();
    file.read(function (err, contents) {
      if (err) return done(err);

      // don't cache between environments
      var dev = this.dev ? '1' : '0';
      var hash = dev + calculate(contents);

      // var opts = {
      //   filename: file.filename,
      //   pretty: options.pretty,
      //   self: options.self,
      //   debug: options.debug,
      //   compileDebug: this.dev,
      //   compiler: options.compiler,
      //   globals: options.globals,
      // };


      // compile into a JS fn
      var res;
      try {
        res =
        cache[hash] = cache[hash]
          || jadeV(contents).toString();
      } catch (err) {
        done(err);
        return;
      }

      file.extension = 'js';

      if (options.runtime) {
        file.string = res;
        file.define = true;
      } else {
        file.string = 'module.exports = ' + res;
      }

      done();
    })
  }
}


function calculate(contents) {
  return crypto.createHash('sha256').update(contents).digest('hex');
}