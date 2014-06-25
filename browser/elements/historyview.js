/* vim: set shiftwidth=2 tabstop=2 noexpandtab textwidth=80 wrap : */
"use strict";

var Emitter = require('emitter');
var render = require('../rendervdom');
var raf = require('raf');
var template = require('template');
var debounce = require('debounce');
var Scrollbars = require('scrollbars');
var qs = require('query');
var classes = require('classes');
var query = require('query');
var closest = require('closest');
var events = require('events');
var zoom = require('image-zoom');
var textcomplete = require('textcomplete');
var _ = require('t');

// WTFjshint
var focus = require('../focus'); // jshint ignore:line
var InfiniteScroll = require('../infinite-scroll');
var Line = require('../../lib').models.Line; // TODO: clean this up a bit

module.exports = HistoryView;

function HistoryView() {
	Emitter.call(this);

	this.redraw = this.redraw.bind(this);
	this.queueDraw = this.queueDraw.bind(this);
	this.room = {history: new Emitter([])};
	this.lastwindow = {lastmsg: null, sH: 0};
	this.init();
	this.gotHistory = function () {};
	this.bind();
	this._bindScroll();
	this.scroll = new InfiniteScroll(this.scrollWindow, this._scrolled.bind(this), 200);
	this.scrollMode = 'automatic';
}

HistoryView.prototype = Object.create(Emitter.prototype);

HistoryView.prototype.bind = function HistoryView_bind() {
	this.events = events(this.el, this);
	this.events.bind('click i.btn-delete', 'deleteMessage');
	this.events.bind('click i.btn-edit', 'selectForEditing');
	this.events.bind('submit .invite-to-room', 'inviteToRoom');
	this.events.bind('input .invite-users', 'resetvalidity');
};

HistoryView.prototype.deleteMessage = function HistoryView_deleteMessage(ev) {
	var el = closest(ev.target, '.message', true);
	classes(el).add('removing');
	if (confirm("Delete the selected Message?")) {
		var id = el.getAttribute('data-id');
		this.emit('deletemessage', this.room, id);
	}
	classes(el).remove('removing');
};

HistoryView.prototype.selectForEditing = function HistoryView_selectForEditing(ev) {
	var el = closest(ev.target, '.message', true);
	classes(el).add('editing');
	var msg = this.room.history.find("id=='" + el.getAttribute('data-id') + "'");
	this.emit('selectedforediting', msg, this.room);
};

HistoryView.prototype.unselectForEditing = function () {
	classes(query(".message.editing", this.el)).add('edited');
	classes(query(".message.editing", this.el)).remove('editing');
};



HistoryView.prototype.init = function HistoryView_init() {
	var el = this.scrollWindow = document.createElement('div');
	el.className = 'chat';
	this.history = {};
	this.redraw();
	el.appendChild(this.history.el);
	// and make it work with custom scrollbars
	document.createElement('div').appendChild(el);
	var scr = new Scrollbars(el);
	this.el = scr.wrapper;
};

// only group messages that are X seconds apart
var TIME_THRESHOLD = 5 * 60 * 1000;

function groupHistory(history) {
	var groups = [];
	var last;
	var group;
	for (var i = 0; i < history.length; i++) {
		var line = history[i];
		if (!last || last.author !== line.author || last.time.getTime() + TIME_THRESHOLD < line.time.getTime())
			groups.push(group = []);
		group.push(last = line);
	}
	return groups;
}

HistoryView.prototype.redraw = function HistoryView_redraw() {
	this.queued = false;

	// update the read messages. Do this before we redraw, so the new message
	// indicator is up to date
	if (this.room.history.length && (!this.lastwindow.lastmsg ||
		(this.scrollMode === 'automatic' && focus.state === 'focus')))
		this.emit('hasread', this.room, this.room.history[this.room.history.length - 1]);

	render(this.history, template('chathistory', {
		room: this.room,
		history: this.room.history,
		groupHistory: groupHistory
	}));

	var history = this.history.el;

	if (this.lastwindow.lastmsg !== this.room.history[0]) {
		// prepend messages:
		// adjust the scrolling with the height of the newly added elements
		this.scrollWindow.scrollTop += this.scrollWindow.scrollHeight - this.lastwindow.sH;
	}
	if (this.scrollMode === 'automatic') {
		// append messages in automatic mode:
		if (focus.state === 'focus' && this.room.history.length) {
			this.scrollTo(history.lastChild);
		} else {
			/* FIXME: since grouping was introduced, this does not work as intended

			// scroll the last read message into view, on the top
			// This makes sure the last read message is on the top, it scrolls as far
			// to the bottom as necessary to have it still in the scrolling view
			history.children[history.children.length - 1 - this.room.unread]
				.scrollIntoView();
			// if the scroll left something on the bottom, set scrolling to manual
			var elem = this.scrollWindow;
			var sT = elem.scrollTop;
			var sTM = elem.scrollTopMax || Math.max(elem.scrollHeight - elem.clientHeight, 0);
			if (sT < sTM)
				this.scrollMode === 'manual';
			*/
		}
	} else {
	}
	this.lastwindow = {lastmsg: this.room.history[0], sH: this.scrollWindow.scrollHeight};
};

HistoryView.prototype.setAuto = function () {
	this.scrollMode = 'automatic';
};

HistoryView.prototype.queueDraw = function HistoryView_queueDraw() {
	if (this.queued) return;
	this.queued = true;
	raf(this.redraw);
};

HistoryView.prototype.scrollTo = function HistoryView_scrollTo(el) {
	if (!el) return;
	// get the last .text and scroll to that
	var texts = qs.all('.text', el);
	if (!texts.length) return;
	texts[texts.length - 1].scrollIntoView();
};

HistoryView.prototype._scrolled = function HistoryView__scrolled(direction, done) {
	// set the scrollMode to automatic when scrolling to the bottom
	if (direction === 'bottom') {
		this.scrollMode = 'automatic';
		return done();
	}
	var oldestLine = this.room.history[0];
	var options = {time_to: oldestLine && oldestLine.time || new Date()};
	var self = this;
	this.gotHistory = function (room, lines) {
		if (lines.length)
			done();
		self.gotHistory = function () {};
	};
	this.emit('needhistory', this.room, options);
};

HistoryView.prototype._bindScroll = function HistoryView__bindScroll() {
	var self = this;
	var updateRead = debounce(function updateRead() {
		if (focus.state !== 'focus')
			return; // we get scroll events even when the window is not focused
		var bottomElem = self._findBottomVisible();
		if (!bottomElem) return;
		var line = Line.get(bottomElem.getAttribute('data-id'));
		self.emit('hasread', self.room, line);
		self.redraw();
	}, 2500);
	var reset = debounce(function () {
		self.scrollMode = 'automatic';
	}, 60 * 1000);
	focus.on('focus', updateRead);
	this.scrollWindow.addEventListener('scroll', updateRead);
	this.scrollWindow.addEventListener('scroll', function () {
		self.scrollMode = 'manual';
		reset();
	});
};

HistoryView.prototype._findBottomVisible = function HistoryView__findBottomVisible() {
	var history = this.history.el;
	var scrollWindow = this.scrollWindow;
	var scrollBottom = scrollWindow.offsetTop + scrollWindow.scrollTop + scrollWindow.clientHeight;
	for (var i = history.children.length - 1; i >= 0; i--) {
		var child = history.children[i];
		var childBottom = child.offsetTop + child.offsetHeight;
		if (childBottom <= scrollBottom) {
			return child;
		}
	}
};

HistoryView.prototype._bindAutocomplete = function HistoryView__bindAutocomplete() {
	var self = this;
	this.inviteInput = qs('.invite-users');
	var el = qs('.autocomplete', this.el);
	if (el !== null) {
		this.complete = textcomplete(this.inviteInput, el);
		this.complete.re = /([\w.+-]+)$/;
		this.complete.formatSelection = function (option) {
			return option.insert + ", ";
		}
		this.complete.query = function (matches) {
			var match = matches[0];

			self.complete.clear();

			var users = app.organization.users;
			for (var i=0; i<users.length; i++) {
				var user = users[i];
				if (  user.firstName.startsWithIgnoreCase(match)
				   || user.lastName.startsWithIgnoreCase(match)
				   || user.username.startsWithIgnoreCase(match)) {
					self.complete.push({
						id: "[" + user.username + "](cg://chatgrape|user|" + user.username + "|/chat/@" + user.username + ")",
						title: '<span class="entry-type-icon type-chatgrapeuser">&nbsp;</span>@' + user.username + ': <img src="' + user.avatar + '" width="16" alt="Avatar of ' + user.firstName + ' ' + user.lastName + '" style="border-radius:50%;margin-bottom:-3px;"/>&nbsp;'+ user.firstName + ' ' + user.lastName + '<span class="entry-type-description">Member</span>',
						insert: user.username,
					});
				}
			}

			self.complete.show();
			self.complete.highlight(0);
		};
	}

	this.inviteButton = qs('.btn-invite', this.el);
}

// TODO: put this in component
Array.prototype.clean = function(deleteValue) {
  for (var i = 0; i < this.length; i++) {
	if (this[i] == deleteValue) {
	  this.splice(i, 1);
	  i--;
	}
  }
  return this;
};

HistoryView.prototype.inviteToRoom = function HistoryView_inviteToRoom(ev) {
	ev.preventDefault();

	var self = this;
	if (this.inviteInput.value === "") {
		self.inviteInput.setCustomValidity(_("Please enter at least one user to invite"));
        self.inviteButton.click();
        return;
	}

	var users = this.inviteInput.value.split(/[\s,;]+/);
	users.clean("");

	console.log("users", users);

	self.emit('inviteToRoom', this.room, users, function inviteToRoom_callback(err, result){
		if(err) {
			self.inviteInput.setCustomValidity(err.details);
			self.inviteButton.click()
		}else {
			alert("invited " + users.length + " users.");
		}
	});
};

HistoryView.prototype.resetvalidity = function HistoryView_resetvalidity() {
	this.inviteInput.setCustomValidity('');
};


HistoryView.prototype.setRoom = function HistoryView_setRoom(room) {
	var self = this;
	// clear that fn
	self.gotHistory = function () {};
	//var history = this.history.el;
	if (this.room) {
		this.room.history.off('removed');
		this.room.history.off('add');
	}
	this.room = room;
	// reset, otherwise we won’t get future events
	this.scroll.reset();
	// and make scrolling mode automatic
	this.scrollMode = 'automatic';

	// mark the last message as read
	if (room.history.length)
		this.emit('hasread', this.room, room.history[room.history.length - 1]);
	else // FIXME:
		this.emit('needhistory', room);

	this.redraw();
	// scroll to bottom
	this.scrollTo(this.history.el.lastChild);

	// we can only do this when the room type is for certain
	this._bindAutocomplete();

	room.history.on('add', function () {
		self.queueDraw();
	});
	room.history.on('remove', function (msg, idx) {
		// find removed element and highlight it....
		// then redraw after timeout
		var el = query("div.message[data-id='" + msg.id + "']", self.el);
		classes(el).add('removed');
		setTimeout(function () {
			// vdom seems to bug a bit so remove the class manually
			// otherwise queueDraw() should be enough
			classes(el).remove('removed');
			self.queueDraw();
		}, 1000);
	});
};

