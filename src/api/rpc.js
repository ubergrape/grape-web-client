'use strict';

var request = require('superagent');
var noop = require('lodash/utility/noop');
var toArray = require('lodash/lang/toArray');
var conf = require('conf');

module.exports = function rpc(ns, action) {
    var args = toArray(arguments).slice(2);
    var callback = args.pop();
    if (typeof callback !== 'function') {
        // add back the argument, and add a bogus function
        args.push(callback);
        callback = noop;
    }
    request
        .post(conf.rpcUrl)
        .send({
            ns: ns,
            action: action,
            args: args
        })
        .end(callback);
};
