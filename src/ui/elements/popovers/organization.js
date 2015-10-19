let Emitter = require('emitter')
let template = require('template')
let render = require('../../rendervdom')
let Popover = require('./popover')
let classes = require('classes')
let qs = require('query')
let roles = require('conf').constants.roles

module.exports = OrganizationPopover

function OrganizationPopover() {
    Popover.call(this)
}

OrganizationPopover.prototype = Object.create(Popover.prototype)

OrganizationPopover.prototype.init = function() {
    Popover.prototype.init.call(this)
    this.content = {}
}

OrganizationPopover.prototype.bind = function() {
    Popover.prototype.bind.call(this)
    this.events.obj.editView = function (e) {
        e.preventDefault()
        let newMode = !ui.settings.compact_mode
        this.emit('editView', newMode)
    }.bind(this)
    this.events.obj.toggleOrgInvite = function () {
        this.emit('toggleOrgInvite')
    }.bind(this)
    this.events.bind('click a.edit-view', 'editView')
    this.events.bind('click .invite-new-members', 'toggleOrgInvite')
}

OrganizationPopover.prototype.redraw = function() {
    if (!this.org || !this.user) return
    this.classes.add('orga-po')
    this.classes.add('top')

    let vdom = template('popovers/organization.jade', {
        isInviter: this.user.role >= this.org.inviter_role,
        isOrgManager: this.user.role >= roles.ROLE_ADMIN
    })

    render(this.content, vdom)
    this.content.classes = classes(this.content.el)
    this.el.appendChild(this.content.el)
}

OrganizationPopover.prototype.onOrgReady = function(org) {
    this.org = org
    this.redraw()
}

OrganizationPopover.prototype.onSetUser = function(user) {
    this.user = user
    this.redraw()
}

OrganizationPopover.prototype.onSettingsReady = function() {
    this.redraw()
}

OrganizationPopover.prototype.onViewChanged = function(compactMode) {
    if (compactMode) {
        classes(document.body).add('client-style-compact')
        classes(document.body).remove('normal-style')
        classes(document.body).remove('client-style-normal')
    } else {
        classes(document.body).add('normal-style')
        classes(document.body).remove('client-style-compact')
        classes(document.body).add('client-style-normal')
    }
    this.redraw()
}