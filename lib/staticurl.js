"use strict";

module.exports = staticurl;

function staticurl(url) {
    if (typeof staticPath === 'undefined')
        return url;
    return (staticPath || '') + url;
}
