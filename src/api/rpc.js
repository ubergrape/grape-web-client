'use strict';

var request = require('superagent');
var noop = require('lodash/utility/noop');
var toArray = require('lodash/lang/toArray');
var conf = require('conf');
var convertCase = require('./convertCase');

module.exports = function rpc(data, callback) {
    callback || (callback = noop);
    request
        .post(conf.rpcUrl)
        .send(convertCase.toSnake(data))
        .end(function(err, res) {
            if (err) return callback(err);
            callback(null, res.body && res.body.response);
        });
};
