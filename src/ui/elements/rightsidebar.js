/* vim: set shiftwidth=2 tabstop=2 noexpandtab textwidth=80 wrap : */
"use strict";

var Emitter = require('emitter');
var template = require('template');
var render = require('../rendervdom');
var ItemList = require('../utils/itemlist');
var qs = require('query');
var events = require('events');
var roles = require('conf').constants.roles;
var classes = require('classes');

module.exports = RightSidebar;

function RightSidebar () {
    Emitter.call(this);
    this.content = {};
    this.initialized = false;
    this.mode = null;
}

RightSidebar.prototype = Object.create(Emitter.prototype);

RightSidebar.prototype.init = function() {
    var membersList = this.membersList = new ItemList({
        template: 'roommembers.jade',
        templateOptions: {
            canKickMembers: this.canKickMembers
        }
    });
    membersList.setItems(this.room.users.slice());

    var searchList = this.searchList = new ItemList({
        template: 'searchresults.jade'
    });
    searchList.setItems([]);

    this.redraw();
    qs('.right-sidebar').appendChild(this.content.el);
    this.bind();
};

RightSidebar.prototype.bind = function() {
    this.events = events(this.content.el, this);
    this.events.bind('click i.btn-delete', 'deleteRoomMember');
    this.events.bind('click .invite-members', 'toggleRoomInvite');
    this.events.bind('click .close-search', 'hide');
};

RightSidebar.prototype.toggleRoomInvite = function(ev) {
    this.emit('toggleRoomInvite', this.room);
};

RightSidebar.prototype.deleteRoomMember = function(ev) {
    var roomID = this.room.id;
    var memberID = ev.target.getAttribute('data-id');
    this.emit('kickMember', roomID, memberID);
};

RightSidebar.prototype.redraw = function() {
    var membersList = this.membersList;
    var searchList = this.searchList;

    var replace = function(from, to) {
        from.parentNode.replaceChild(to, from);
    };
    var memberCount = this.room.users.length.toString();

    render(this.content, template('rightsidebar.jade', {
        mode: this.mode,
        memberCount: memberCount
    }));
    membersList.order('displayName');
    membersList.redraw();
    searchList.redraw();

    switch (this.mode) {
        case 'members':
            replace(qs('.user-list', this.content.el), membersList.el);
            break;
        case 'search':
            replace(qs('.search-list', this.content.el), searchList.el);
            break;
        default:
            break;
    }
};

RightSidebar.prototype.setRoom = function(room) {
    this.room = room;
    this.canKickMembers = ui.user === room.creator || ui.user.role >= roles.ROLE_ADMIN;

    if (!this.initialized) {
        this.init();
        this.initialized = true;
    } else {
        this.membersList.items = this.room.users.slice();
        this.membersList.templateOptions.canKickMembers = this.canKickMembers;
        this.membersList.redraw();
    }
};

RightSidebar.prototype.onMemberLeftChannel = function(room, user) {
    if (room != this.room) return;
    var userIndex = this.membersList.items.indexOf(user);
    if (userIndex > -1) this.membersList.items.splice(userIndex, 1);
    this.redraw();
};

RightSidebar.prototype.onChangeUser = function(user) {
    if (this.initialized && this.room.users.indexOf(user) > -1) this.membersList.redraw();
};

RightSidebar.prototype.onNewRoomMember = function(room, user) {
    if (room != this.room) return;
    this.membersList.items.push(user);
    this.redraw();
};

RightSidebar.prototype.gotSearchResults = function(results) {
    this.searchList.items = results.results;
    this.searchList.redraw();
};

RightSidebar.prototype.show = function(mode) {
    var clientBody = qs('.client-body');
    classes(clientBody).add('right-sidebar-show')
    this.mode = mode;
    this.redraw();
};

RightSidebar.prototype.hide = function() {
    var clientBody = qs('.client-body');
    classes(clientBody).remove('right-sidebar-show')
    this.mode = null;
    this.redraw();
};

RightSidebar.prototype.toggle = function(mode) {
    if (mode == this.mode) this.hide();
    else this.show(mode);
}