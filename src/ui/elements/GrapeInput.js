import Emitter from 'emitter'
import template from 'template'
import events from 'events'
import qs from 'query'
import debounce from 'lodash/function/debounce'
import defaults from 'lodash/object/defaults'
import clone from 'lodash/lang/clone'

import staticurl from 'staticurl'
import render from '../rendervdom'
import grapeBrowser from 'grape-browser'

const IMAGES_BASE = staticurl('app/cg/images')

const IMAGES = {
	emojiSheet: IMAGES_BASE + '/emoji_sheet_32_optimized.png',
	traubyReading: IMAGES_BASE + '/trauby-reading.png',
	traubyJuggling: IMAGES_BASE + '/trauby-juggling.png',
	noDetail: IMAGES_BASE + '/no-detail.png',
	spinner: staticurl('/images/preloader-onwhite.gif')
}

function GrapeInput() {
	Emitter.call(this)
	this.room = null
	this.previous = null
	this.org = null
	this.redraw()
	this.placeholder = 'Enter a message ...'
	this.typing = false
	// Key is room id, value is unsent text message.
	this.unsent = {}
	this.images = clone(IMAGES)
}

GrapeInput.prototype = Object.create(Emitter.prototype)
module.exports = GrapeInput

GrapeInput.prototype.init = function () {
	if (this.initialized) return
	this.initialized = true
	this.bindEvents()
	this.input = qs('grape-input', this.el)
	this.images.orgLogo = this.org.logo
	this.setProps({focused: true})
}

GrapeInput.prototype.setProps = function (newProps) {
	this.input.props = defaults(newProps, {
		images: this.images,
		customEmojis: this.org.custom_emojis,
		placeholder: this.placeholder,
		hasIntegrations: this.org.has_integrations
	})
}

GrapeInput.prototype.bindEvents = function () {
	this.events = events(this.el, this)
	this.events.bind('click .js-markdown-tips', 'onMarkdownTipsShow')
	this.events.bind('mousedown .js-emoji-browser-button', 'onOpenEmojiBrowser')
	this.events.bind('mousedown .js-search-browser-button', 'onOpenSearchBrowser')
	this.events.bind('grapeComplete grape-input', 'onComplete')
	this.events.bind('grapeSelectFilter grape-input', 'onSelectFilter')
	this.events.bind('grapeEditPrevious grape-input', 'onEditPrevious')
	this.events.bind('grapeAbort grape-input', 'onAbort')
	this.events.bind('grapeChange grape-input', 'onChange')
	this.events.bind('grapeSubmit grape-input', 'onSubmit')
	this.events.bind('grapeFocus grape-input', 'onFocus')
	this.events.bind('grapeBlur grape-input', 'onBlur')
	this.events.bind('grapeAddIntegration grape-input', 'onAddIntegration')
	this.events.bind('grapeInsertItem grape-input', 'onInsertItem')
}

GrapeInput.prototype.disable = function () {
	if (this.input.props.disabled) return
	this.completePreviousEdit()
	this.el.classList.add('disabled')
	this.setProps({
		disabled: true,
		placeholder: 'You cannot reply to this conversation.'
	})
}

GrapeInput.prototype.enable = function () {
	if (!this.input.props.disabled) return
	this.el.classList.remove('disabled')
	this.setProps({
		disabled: false,
		placeholder: this.placeholder
	})
}

GrapeInput.prototype.redraw = function () {
	let vdom = template('grapeInput.jade', {})
	render(this, vdom)
}

GrapeInput.prototype.showSearchBrowser = function (key) {
	let props = this.input.props
	// Show browser immediately with empty state.
	this.setProps({
		browser: 'search',
		data: props.browser == 'search' ? props.data : null,
		isLoading: true
	})
	this.debouncedSearch(key)
}

GrapeInput.prototype.showUsersAndRooms = function (key) {
	key = key.toLowerCase()
	let users = this.findUsers(key)
	let rooms = this.findRooms(key)
	let data = users.concat(rooms)
	this.setProps({
		browser: 'user',
		data: data
	})
}

GrapeInput.prototype.showEmojiBrowser = function () {
	this.setProps({browser: 'emoji'})
}

GrapeInput.prototype.findUsers = function (key) {
	let users = this.org.users.toArray()

	// Remove unactive users.
	users = users.filter(function(user) {
		return user.active
	})

	// Map to a unified data structure.
	users = users.map(function (user) {
		let name = user.username
		if (user.firstName) {
			name = user.firstName
			if (user.lastName) name += ' ' + user.lastName
		}

		return {
			id: user.id,
			name: name,
			username: user.username,
			iconURL: user.avatar,
			type: 'user'
		}
	})

	// Do the search.
	users = users.filter(function(user) {
		if (user.name.toLowerCase().indexOf(key) >= 0 ||
			user.username.toLowerCase().indexOf(key) >= 0) {
			return true
		}
	})

	return users
}

GrapeInput.prototype.findRooms = function (key) {
	let rooms = this.org.rooms.toArray()

	rooms = rooms.map(function (room) {
		return {
			id: room.id,
			type: 'room',
			name: room.name,
			slug: room.slug
		}
	})

	// Do the search.
	rooms = rooms.filter(function(room) {
		return room.name.toLowerCase().indexOf(key) >= 0
	})

	return rooms
}

GrapeInput.prototype.completePreviousEdit = function () {
	if (!this.previous) return
	this.previous.el.classList.remove('editing')
	this.el.classList.remove('editing-previous')

	let avatar = qs('.avatar.editing')
	if (avatar) {
		avatar.classList.remove('editing')
	}

	this.input.setTextContent('')
	this.previous = null
}

GrapeInput.prototype.editMessage = function (msg) {
	this.completePreviousEdit()
	let el = qs('.message[data-id="' + msg.id + '"]')
	el.classList.add('editing')
	this.el.classList.add('editing-previous')
	this.input.setTextContent(msg.text)
	this.previous = {
		msg: msg,
		el: el
	}
}

GrapeInput.prototype.findPreviousMessage = function () {
	let message
	let history = this.room.history.slice().reverse()
	history.some(function(msg) {
		// TODO avoid globals.
		if (msg.author == ui.user && !msg.attachments.length) {
			message = msg
			return true
		}
	})

	return message
}

GrapeInput.prototype.debouncedStopTyping = debounce(function () {
	this.typing = false
	this.emit('stoptyping', this.room)
}, 5000)

GrapeInput.prototype.getImageAttachments = function (objects) {
	// Find embeddable images.
	objects = objects.filter(function (obj) {
		if (isImage(obj.mime_type) &&
			obj.detail &&
			obj.detail.preview &&
			obj.detail.preview.embeddable) {
			return true
		}
		return false
	})

	let attachments = objects.map(function (obj) {
		let image = obj.detail.preview.image

		return {
			name: obj.name,
			url: obj.url,
			source: obj.service,
			mime_type: obj.mime_type,
			thumbnail_url: image.url,
			thumbnail_width: image.width,
			thumbnail_height: image.height
		}
	})

	return attachments
}

GrapeInput.prototype.onMarkdownTipsShow = function () {
	this.emit('showmarkdowntips')
}

GrapeInput.prototype.onComplete = function (e) {
	let query = e.detail

	switch (query.trigger) {
		case '#':
			this.showSearchBrowser(query.key)
			break
		case '@':
			this.showUsersAndRooms(query.key)
			break
	}
}

GrapeInput.prototype.onSelectFilter = function (e) {
	this.emit('autocomplete', e.detail.key, function (err, data) {
		if (err) return this.emit('error', err)
		this.setProps({
			browser: 'search',
			data: data
		})
	}.bind(this))
}

GrapeInput.prototype.onEditPrevious = function () {
	let msg = this.findPreviousMessage()
	if (msg) this.editMessage(msg)
}

GrapeInput.prototype.onAbort = function (e) {
	let data = e.detail

	// Don't abort editing if browser has been open.
	if (!data.browser) this.completePreviousEdit()
	if (data.browser == 'search' && data.reason == 'esc') {
		analytics.track('abort autocomplete', data)
	}
}

GrapeInput.prototype.onChange = function () {
	if (!this.typing) {
		this.typing = true
		this.emit('starttyping', this.room)
	}
	this.debouncedStopTyping()
}

GrapeInput.prototype.debouncedSearch = debounce(function (key) {
	this.emit('autocomplete', key, function (err, data) {
		if (err) return this.emit('error', err)
		this.setProps({
			browser: 'search',
			data: data
		})
	}.bind(this))
}, 200)

GrapeInput.prototype.onSubmit = function (e) {
	let data = e.detail

	if (this.previous) {
		this.emit('update', this.previous.msg, data.content)
		this.completePreviousEdit()
	}
	else {
		let sendText = true
		let attachments = this.getImageAttachments(data.objects)
		// If a message text contains only media objects we will render a preview
		// in the history for, there is no need to send this objects as text.
		if (data.objectsOnly && attachments.length === data.objects.length) {
			sendText = false
		}
		// Separate message to make it separately editable and removable.
		if (sendText) this.emit('input', this.room, data.content)
		if (attachments.length) {
			this.emit('input', this.room, '', {attachments: attachments})
		}
		this.input.setTextContent('')
	}
}

GrapeInput.prototype.onFocus = function () {
	this.el.classList.add('focus')
}

GrapeInput.prototype.onBlur = function () {
	this.el.classList.remove('focus')
}

GrapeInput.prototype.onOpenEmojiBrowser = function (e) {
	e.preventDefault()
	this.showEmojiBrowser()
}

GrapeInput.prototype.onOpenSearchBrowser = function (e) {
	e.preventDefault()
	this.showSearchBrowser('')
}

GrapeInput.prototype.onOrgReady = function (org) {
	this.org = org
	this.init()
}

GrapeInput.prototype.onAddIntegration = function () {
	location.href = '/services/list'
}

GrapeInput.prototype.onInsertItem = function (e) {
	analytics.track('insert autocomplete object', e.detail)
}

GrapeInput.prototype.onSelectChannel = function (room) {
	if (this.room) this.unsent[this.room.id] = this.input.getTextContent()
	this.completePreviousEdit()
	if (!room || (room.type == "pm" && !room.users[0].active)) {
		this.disable()
	}
	else {
		this.enable()
	}
	this.room = room
	this.input.setTextContent(this.unsent[room.id] || '')
}


function isImage(mime) {
	return String(mime).substr(0, 5) == 'image'
}
