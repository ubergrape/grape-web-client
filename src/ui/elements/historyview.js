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
var closest = require('closest');
var events = require('events');
var zoom = require('image-zoom');
var focus = require('../focus');
var InfiniteScroll = require('../infinite-scroll');

template.locals.tz = require('moment-timezone');

module.exports = HistoryView;

// TODO set firstMsgTime for thr very first message in a room
function HistoryView() {
	Emitter.call(this);
	this.mode = 'chat'; // can be either "search" or "chat"
	this.redraw = this.redraw.bind(this);
	this.queueDraw = this.queueDraw.bind(this);
	this.room = {history: new Emitter([])};
	this.lastwindow = {lastmsg: null, sH: 0};
	this.init();
	this.bind();
	this.scroll = new InfiniteScroll(this.scrollWindow, this._scrolled.bind(this), 0);
	this.scrollMode = 'automatic';
	this.on('needhistory', function () { this.room.loading = true; });
	this.unsentBuffer = {};
	this.requestedMsgID = null;
	this.isFirstMsgLoaded = false;
	this.isLastMsgLoaded = false;
}

HistoryView.prototype = Object.create(Emitter.prototype);

HistoryView.prototype.init = function HistoryView_init() {
	var el = this.scrollWindow = document.createElement('div');
	el.className = 'chat';
	this.history = {};
	this.typing = {};
	this.redraw();
	el.appendChild(this.history.el);
	this.redrawTyping();
	el.appendChild(this.typing.el);
	// and make it work with custom scrollbars
	document.createElement('div').appendChild(el);
	var scr = new Scrollbars(el);
	this.el = scr.wrapper;
};

HistoryView.prototype.bind = function HistoryView_bind() {
	this.events = events(this.el, this);
	this.events.bind('click .show-invite', 'toggleInvite');
	this.events.bind('click i.btn-delete', 'deleteMessage');
	this.events.bind('click i.btn-edit', 'selectForEditing');
	this.events.bind('click i.btn-delete-from-buffer', 'removeFromBuffer');
	this.events.bind('click a.show-more', 'expandActivityList');
	this.events.bind('click a.show-less', 'collapseActivityList');
	this.events.bind('click div.resend', 'resend');
	this.events.bind('click div.load-newer-history', 'loadNewHistory');
	this.events.bind('click div.load-older-history', 'loadOldHistory');
	this.events.bind('click div.load-newest-history', 'loadNewestHistory');
	var debouncedUpdateRead = debounce(this.updateRead.bind(this), 1500);
	focus.on('focus', debouncedUpdateRead);
	this.scrollWindow.addEventListener('scroll', function () {
		this.scrollMode = 'manual';
	}.bind(this));
};

HistoryView.prototype.onOrgReady = function HistoryView_onOrgReady (org) {
	if (Object.keys(this.unsentBuffer) != 0) return;
	org.rooms.forEach( function (room) {
		this.unsentBuffer[room.id] = [];
	}.bind(this));
	org.pms.forEach( function (pm) {
		this.unsentBuffer[pm.id] = [];
	}.bind(this));
}

HistoryView.prototype.toggleInvite = function () {
	this.emit('toggleInvite', this.room);
}

HistoryView.prototype.deleteMessage = function HistoryView_deleteMessage(ev) {
	var el = closest(ev.target, '.message', true);
	classes(el).add('removing');
	if (confirm("Delete the selected Message?")) {
		var id = el.getAttribute('data-id');
		this.emit('deleteMessage', this.room, id);
	}
	classes(el).remove('removing');
};

HistoryView.prototype.removeFromBuffer = function HistoryView_removeFromBuffer (ev) {
	var msgClientSideID = closest(ev.target, '.message', true).getAttribute('data-id');
	var bufferedMsg = this.findBufferedMsg(msgClientSideID);
	if (!bufferedMsg) return;
	var roomUnsentMsgs = this.unsentBuffer[this.room.id];
	roomUnsentMsgs.splice(roomUnsentMsgs.indexOf(bufferedMsg), 1);
	this.queueDraw();
};

HistoryView.prototype.loadNewHistory = function HistoryView_loadNewHistory () {
	var options = {
		time_from	: this.room.searchHistory[this.room.searchHistory.length - 1].time,
		sort		: 'time:asc',
		limit		: 5
	}
	this.emit('loadHistoryForSearch', 'new', this.room, options);
};

HistoryView.prototype.loadNewestHistory = function HistoryView_loadNewestHistory () {
	this.emit('switchToChatMode', this.room);
};

HistoryView.prototype.loadOldHistory = function HistoryView_loadOldHistory () {
	var options = {
		time_to	: this.room.searchHistory[0].time,
		limit	: 5
	};
	this.emit('loadHistoryForSearch', 'old', this.room, options);
};

HistoryView.prototype.selectForEditing = function HistoryView_selectForEditing(ev) {
	var el = closest(ev.target, '.message', true);
	classes(el).add('editing');

	if (el.parentNode.childNodes[0] === el) {
		var avatar = qs('.avatar', el.parentNode.parentNode.parentNode);
		classes(avatar).add('editing');
	}

	var msg = this.room.history.find("id=='" + el.getAttribute('data-id') + "'");
	this.emit('selectedforediting', msg, this.room);
};

HistoryView.prototype.unselectForEditing = function () {
	var msg = qs(".message.editing", this.el);
	if (msg) {
		classes(msg).add('edited');
		classes(msg).remove('editing');
	}
};

// only group messages that are X seconds apart
var TIME_THRESHOLD = 5 * 60 * 1000;

function groupHistory(history) {
	var groups = [];
	var counter = 1;
	var last;
	var group;
	var previousLine;

	for (var i = 0; i < history.length; i++) {
		var	line			= history[i],
			author			= line.author,
			isService		= author.type == "service",
			isTimeSpanShort	= last && last.time.getTime() + TIME_THRESHOLD > line.time.getTime(),
			hasSameTitle	= last && line.title && line.title == last.title && !line.objects,
			hasSameMsg		= last && last.message && line.message && last.message == line.message,
			hasSameAuthor	= last && last.author.id == author.id,
			afterAttachment = last && last.attachments && last.attachments.length != 0,
			hasAttachments	= line.attachments && line.attachments.length != 0,
			isGroupable		= isTimeSpanShort && hasSameAuthor && !hasAttachments && !afterAttachment;

		// Message is groupable, nice and easy
		if (isGroupable) {
			if (isService && ( hasSameTitle || hasSameMsg )) {
				group.pop();
				counter++;
				line.times = counter.toString(); // convert to string cause jade gets crazy with numbers
			} else if (isService) {
				groups.push(group = []);
				counter = 1;
			}
		} else {
			groups.push(group = []);
			counter = 1;
		}

		group.push(last = line);
	}

	return groups;
};

HistoryView.prototype.redraw = function HistoryView_redraw() {
	this.queued = false;

	if (this.mode === 'chat') {
		// update the read messages. Do this before we redraw, so the new message
		// indicator is up to date
		if (this.room.history.length && (!this.lastwindow.lastmsg ||
			(this.scrollMode === 'automatic' && focus.state === 'focus'))) {
			this.emit('hasread', this.room, this.room.history[this.room.history.length - 1].id);
		}
		// create a copy of the history
		var history = this.room.history.slice();
		// merge buffered messages with copy of history
		if (this.unsentBuffer) {
			var roomUnsentMsgs = this.unsentBuffer[this.room.id];
			if (roomUnsentMsgs) history = history.concat(roomUnsentMsgs);			
		};
	} else {
		var history = this.room.searchHistory.slice();
		var requestedMsg = history.filter( function (msg) {
				return msg.id === this.requestedMsgID;
			}.bind(this))[0];
		var prevMsgID = history.indexOf(requestedMsg) > 0 ? history[history.indexOf(requestedMsg) - 1].id : this.requestedMsgID;
	}

	// eventually group history
	var groupedHistory = groupHistory(history);

	render(this.history, template('chathistory.jade', {
		room: this.room,
		history: groupedHistory,
		mode: this.mode,
		requestedMsgID: this.requestedMsgID,
		isFirstMsgLoaded: this.isFirstMsgLoaded,
		isLastMsgLoaded: this.isLastMsgLoaded
	}));

	if (this.lastwindow.lastmsg !== this.room.history[0])
		this.scrollWindow.scrollTop += this.scrollWindow.scrollHeight - this.lastwindow.sH;

	this.lastwindow = { lastmsg: this.room.history[0], sH: this.scrollWindow.scrollHeight };

	if (this.scrollMode === 'automatic') {
		if (this.mode === 'chat') return this.scrollBottom();
		var prevMsgEl = qs("div.message[data-id='" + prevMsgID + "']", this.el);
		var requestedMsgEl = qs("div.message[data-id='" + requestedMsg.id + "']", this.el);
		var scrollTarget = prevMsgEl ? prevMsgEl : requestedMsgEl;
		scrollTarget.scrollIntoView();
	}
};

HistoryView.prototype.scrollBottom = function() {
	this.scrollWindow.scrollTop = this.scrollWindow.scrollHeight;
};

HistoryView.prototype.updateRead = function HistoryView_updateRead () {
	if (focus.state !== 'focus') return; // we get scroll events even when the window is not focused
	var bottomElem = this._findBottomVisible();
	if (!bottomElem) return;
	var lineID = bottomElem.getAttribute('data-id');
	this.emit('hasread', this.room, lineID);
	this.queueDraw()
};

HistoryView.prototype.queueDraw = function HistoryView_queueDraw() {
	if (this.queued) return;
	this.queued = true;
	raf(this.redraw);
};

HistoryView.prototype._scrolled = function HistoryView__scrolled(direction, done) {
	if (this.mode === 'search') return;
	if (direction === 'bottom') {
		this.scrollMode = 'automatic';
		var debouncedUpdateRead	= debounce(this.updateRead.bind(this), 1500)
		debouncedUpdateRead();
		return done();
	} else {
		if (!this.room.empty) done();
	}
	var oldestLine = this.room.history[0];
	var options = {time_to: oldestLine && oldestLine.time || new Date()};
	this.emit('needhistory', this.room, options);
};

HistoryView.prototype.firstMsgLoaded = function HistoryView_firstMsgLoaded (history) {
	var firstLoadedMsg = history[0];
	if (firstLoadedMsg && new Date(firstLoadedMsg.time).getTime() === this.room.first_message_time)
		return true;
	return false;
};

HistoryView.prototype.lastMsgLoaded = function HistoryView_lastMsgLoaded (history) {
	var lastLoadedMsg = history[history.length - 1];
	if (lastLoadedMsg && new Date(lastLoadedMsg.time).getTime() === this.room.latest_message_time)
		return true;
	return false;
};

HistoryView.prototype.onGotHistory = function HistoryView_onGotHistory (direction) {
	this.room.loading = false;
	this.room.empty = false;
	var displayedHistory = this.mode === 'chat' ? this.room.history : this.room.searchHistory;
	this.isFirstMsgLoaded = this.firstMsgLoaded(displayedHistory);
	this.isLastMsgLoaded = this.lastMsgLoaded(displayedHistory);
	this.queueDraw();
};

HistoryView.prototype.noHistory = function HistoryView_noHistory() {
	this.room.empty = true;
	this.room.loading = false;
	this.isFirstMsgLoaded = false;
	this.isLastMsgLoaded = false;
	this.queueDraw();
};

HistoryView.prototype._findBottomVisible = function HistoryView__findBottomVisible() {
	var history = this.history.el;
	var scrollWindow = this.scrollWindow;
	var scrollBottom = scrollWindow.offsetTop + scrollWindow.scrollTop + scrollWindow.clientHeight;
	for (var i = history.children.length - 1; i >= 0; i--) {
		var child = history.children[i];
		var childBottom = child.offsetTop + child.offsetHeight;
		if (childBottom <= scrollBottom) return child;
	}
};

HistoryView.prototype.setRoom = function HistoryView_setRoom(room, msgID) {
	var self = this;
	this.requestedMsgID = null;
	if (this.room) this.room.history.off('removed');
	this.room = room;
	this.scroll.reset(); // reset, otherwise we won't get future events
	this.scrollMode = 'automatic';
	if (!msgID) {
		if (this.room.empty === undefined) {
			this.emit('needhistory', room);
		} else {
			this.isFirstMsgLoaded = this.firstMsgLoaded(room.history);
			this.isLastMsgLoaded = this.lastMsgLoaded(room.history);
		}
		this.mode = 'chat';
		this.queueDraw();
	} else {
		this.emit('requestMessage', room, msgID);
		this.room.loading = true;
	}
	this.redrawTyping();
	
	room.history.on('remove', function (msg, idx) {
		// find removed element and highlight it....
		// then redraw after timeout
		var el = qs("div.message[data-id='" + msg.id + "']", self.el);
		var avatar = qs(".avatar", el.parentNode.parentNode.parentNode);
		classes(el).add('removed');
		classes(avatar).add('removed');
		setTimeout(function () {
			// vdom seems to bug a bit so remove the class manually
			// otherwise queueDraw() should be enough
			classes(el).remove('removed');
			classes(avatar).remove('removed');
			self.queueDraw();
		}, 1000);
	});
	room.off('change typing');
	room.on('change typing', function() {
		self.redrawTyping();
	});
};

HistoryView.prototype.redrawTyping = function HistoryView_redrawTyping() {
	render(this.typing, template('typingnotifications.jade', {
		room: this.room,
		mode: this.mode
	}));
};

HistoryView.prototype.expandActivityList = function HistoryView_expandActivityList (ev) {
	var el = closest(ev.target, 'ul', true);
	classes(el).remove('list-previewed');
};

HistoryView.prototype.collapseActivityList = function HistoryView_collapseActivityList (ev) {
	var el = closest(ev.target, 'ul', true);
	classes(el).add('list-previewed');
}

HistoryView.prototype.onInput = function HistoryView_onInput (room, msg, options) {
	if (this.mode === 'search') this.emit('switchToChatMode', room);
	var attachments = options && options.attachments ? options.attachments : [];
	var newMessage = {
		clientSideID: (Math.random() + 1).toString(36).substring(7),
		text: msg,
		status: "pending",
		author: ui.user,
		time: new Date(),
		attachments: attachments,
		read: true,
		channel: room
	};
	this.unsentBuffer[room.id].push(newMessage);
	this.scrollMode = 'automatic';
	this.emit('stoptyping', room);
	this.queueDraw();
	this.handlePendingMsg(newMessage);
};

HistoryView.prototype.findBufferedMsg = function HistoryView_findBufferedMsg (clientSideID) {
	var bufferedMsg = null;
	this.unsentBuffer[this.room.id].every(function(message) {
		if (clientSideID == message.clientSideID) {
			bufferedMsg = message;
			return false;
		}
		return true;
	});
	return bufferedMsg;
};

HistoryView.prototype.onNewMessage = function HistoryView_onNewMessage (line) {
	if (line.channel != this.room || this.mode === 'search') return;
	if (line.author == ui.user) {
		var bufferedMsg = this.findBufferedMsg(line.clientside_id);
		var roomUnsentMsgs = this.unsentBuffer[line.channel.id];
		if (bufferedMsg) roomUnsentMsgs.splice(roomUnsentMsgs.indexOf(bufferedMsg), 1);
	}
	this.queueDraw();
};

HistoryView.prototype.onNewPMOpened = function HistoryView_onNewPMOpened (pm) {
	// on new pms opened by the visitor
	this.unsentBuffer[pm.id] = [];
};

HistoryView.prototype.onNewRoom = function HistoryView_onNewRoon (channel) {
	// on new public rooms
	// new private rooms the visitor get invited to
	// new pms opened by the pm partner
	this.unsentBuffer[channel.id] = [];
};

HistoryView.prototype.onChangeUser = function HistoryView_onChangeUser (channel, changed) {
	if (changed && changed.indexOf('title') != -1) {
		this.queueDraw();
	}
	// TODO: also handle first_name, last_name changes
};

HistoryView.prototype.onFocusMessage = function HistoryView_onFocusMessage (msgID) {
	this.mode = 'search';
	this.emit('switchToSearchMode');
	this.scroll.reset(); // reset, otherwise we won't get future events
	this.requestedMsgID = msgID;
	this.room.loading = false;
	this.isFirstMsgLoaded = this.firstMsgLoaded(this.room.searchHistory);
	this.isLastMsgLoaded = this.lastMsgLoaded(this.room.searchHistory);
	this.redrawTyping();
	this.queueDraw();
};

HistoryView.prototype.resend = function HistoryView_resend (e) {
	var clientSideID = e.target.getAttribute('data-id');
	var bufferedMsg = this.findBufferedMsg(clientSideID);
	if (!bufferedMsg) return;
	bufferedMsg.status = "pending";
	this.queueDraw();
	this.handlePendingMsg(bufferedMsg);
};

HistoryView.prototype.handlePendingMsg = function HistoryView_handlePendingMsg (msg) {
	var options = {
		clientside_id: msg.clientSideID,
		attachments: msg.attachments		
	}
	this.emit('send', msg.channel, msg.text, options);

	setTimeout(function() {
		if (this.unsentBuffer[msg.channel.id].indexOf(msg) > -1) {
			msg.status = "unsent";
			this.queueDraw();
		}
	}.bind(this), 5000);
};

HistoryView.prototype.onUploading = function HistoryView_onUploading () {
	if (this.mode === 'chat') return;
	this.emit('switchToChatMode', this.room);
};