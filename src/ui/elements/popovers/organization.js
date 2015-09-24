/* vim: set shiftwidth=2 tabstop=2 noexpandtab textwidth=80 wrap : */
"use strict";

var Emitter = require('emitter');
var template = require('template');
var render = require('../../rendervdom');
var Popover = require('./popover');
var classes = require('classes');
var qs = require('query');

module.exports = OrganizationPopover;

function OrganizationPopover() {
    Popover.call(this);
}

OrganizationPopover.prototype = Object.create(Popover.prototype);

OrganizationPopover.prototype.init = function OrganizationPopover_init() {
    Popover.prototype.init.call(this);
    this.content = {};
    this.redraw();
    this.content.classes = classes(this.content.el);
    this.el.appendChild(this.content.el);
};

OrganizationPopover.prototype.bind = function OrganizationPopover_bind() {
    Popover.prototype.bind.call(this);
    this.events.obj.editView = function (e) {
        e.preventDefault();
        var newMode = !ui.settings.compact_mode;
        this.emit('editView', newMode);
    }.bind(this);
    this.events.obj.toggleOrgInvite = function () {
        this.emit('toggleOrgInvite');
    }.bind(this);
    this.events.bind('click a.edit-view', 'editView');
    this.events.bind('click .invite-new-members', 'toggleOrgInvite');
};

OrganizationPopover.prototype.redraw = function OrganizationPopover_redraw() {
    this.classes.add('orga-po');
    this.classes.add('top');

    var userRole = 0;

    if (typeof ui != 'undefined') {
        userRole = ui.user.role;
    }

    var vdom = template('popovers/organization.jade', {
        role: userRole
    });

    render(this.content, vdom);
};

OrganizationPopover.prototype.onOrgReady = function OrganizationPopover_onOrgReady(org) {
    this.redraw();
}

OrganizationPopover.prototype.onSettingsReady = function OrganizationPopover_onSettingsReady() {
    this.redraw();
}

OrganizationPopover.prototype.onViewChanged = function OrganizationPopover_onViewChanged(compactMode) {
    if (compactMode) {
        classes(document.body).add('client-style-compact');
        classes(document.body).remove('normal-style');
        classes(document.body).remove('client-style-normal');
    } else {
        classes(document.body).add('normal-style');
        classes(document.body).remove('client-style-compact');
        classes(document.body).add('client-style-normal');
    }
     this.redraw();
}