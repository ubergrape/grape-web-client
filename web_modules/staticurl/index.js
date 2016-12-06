"use strict";

var conf = require('conf');

function staticurl(url) {
  const path = __STATIC_PATH__ || conf.server.staticPath;
  return (path || '') + url;
}

module.exports = staticurl;

