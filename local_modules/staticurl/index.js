"use strict";

var conf = require('conf');

function staticurl(url) {
    if (!conf.staticPath) return url;
    return (conf.staticPath || '') + url;
}

module.exports = staticurl;

