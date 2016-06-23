"use strict";

var conf = require('conf');

function staticurl(url) {
    if (!conf.server.staticPath) return url;
    return (conf.server.staticPath || '') + url;
}

module.exports = staticurl;

