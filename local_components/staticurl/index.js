"use strict";

module.exports = staticurl;

function staticurl(url) {
    //TODO: don't use global vars (staticPath)
    if (typeof staticPath === 'undefined')
        return url;
    return (staticPath || '') + url;
}
