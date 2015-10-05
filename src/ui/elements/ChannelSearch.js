'use strict';

var Emitter = require('emitter');

require('../../../react-components/channel-search');

function ChannelSearch() {
    Emitter.call(this);
    this.el = document.createElement('grape-channel-search');
}

ChannelSearch.prototype = Object.create(Emitter.prototype);
module.exports = ChannelSearch;

ChannelSearch.prototype.redraw = function () {
};

ChannelSearch.prototype.onOrgReady = function (org) {
    this.org = org;
    this.redraw();
};
