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

// WTFjshint
var focus = require('../focus'); // jshint ignore:line
var InfiniteScroll = require('../infinite-scroll');
var Line = require('cglib').models.Line; // TODO: clean this up a bit

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
	this.messageBuffer = [];
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
	this.events.bind('click i.btn-delete', 'deleteMessage');
	this.events.bind('click i.btn-edit', 'selectForEditing');
	this.events.bind('click a.show-invite', 'toggleInvite');
	this.events.bind('click a.show-more', 'showMore');
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

HistoryView.prototype.deleteMessage = function HistoryView_deleteMessage(ev) {
	var el = closest(ev.target, '.message', true);
	classes(el).add('removing');
	if (confirm("Delete the selected Message?")) {
		var id = el.getAttribute('data-id');
		this.emit('deleteMessage', this.room, id);
	}
	classes(el).remove('removing');
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
}

HistoryView.prototype.loadOldHistory = function HistoryView_loadOldHistory () {
	var options = {
		time_to	: this.room.searchHistory[0].time,
		limit	: 5
	};
	this.emit('loadHistoryForSearch', 'old', this.room, options);
}

HistoryView.prototype.selectForEditing = function HistoryView_selectForEditing(ev) {
	var el = closest(ev.target, '.message', true);
	classes(el).add('editing');
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
	var	groups	= [],
		counter	= 1,
		last,
		group;

	for (var i = 0; i < history.length; i++) {
		var	line			= history[i],
			author			= line.author,
			isService		= author.type == "service",
			isTimeSpanShort	= last && last.time.getTime() + TIME_THRESHOLD > line.time.getTime(),
			hasSameTitle	= last && line.title && line.title == last.title && !line.objects,
			hasSameMsg		= last && last.message && line.message && last.message == line.message,
			hasSameAuthor	= last && last.author.id == author.id,
			isGroupable		= isTimeSpanShort && hasSameAuthor;

		if (isGroupable) {
			if (isService && ( hasSameTitle || hasSameMsg )) {
				group.pop();
				counter++;
				line.times = counter.toString(); // convert to string cause jade gets crazy with numbers		
			}
		} else {
			groups.push(group = []); 
			counter = 1;		
		}

		group.push(last = line);
	}
	return groups;
}

HistoryView.prototype.redraw = function HistoryView_redraw() {
	this.queued = false;

	if (this.mode === 'chat') {
		// update the read messages. Do this before we redraw, so the new message
		// indicator is up to date
		if (this.room.history.length && (!this.lastwindow.lastmsg ||
			(this.scrollMode === 'automatic' && focus.state === 'focus'))) {
			this.emit('hasread', this.room, this.room.history[this.room.history.length - 1]);
		}
		// create a copy of the history
		var history = this.room.history.slice();
		// merge buffered messages with copy of history
		if (this.messageBuffer) history = history.concat(this.messageBuffer);
	} else {
		var history = this.room.searchHistory.slice();
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

	if (this.scrollMode === 'automatic') this.scrollBottom();
	if (this.scrollMode === 'manual' && this.mode === 'search') this.scrollWindow.scrollTop = 0;
	this.lastwindow = { lastmsg: this.room.history[0], sH: this.scrollWindow.scrollHeight };
};

HistoryView.prototype.scrollBottom = function() {
	this.scrollWindow.scrollTop = this.scrollWindow.scrollHeight;
};

HistoryView.prototype.updateRead = function HistoryView_updateRead () {
	if (focus.state !== 'focus') return; // we get scroll events even when the window is not focused
	var bottomElem = this._findBottomVisible();
	if (!bottomElem) return;
	var line = Line.get(bottomElem.getAttribute('data-id'));
	if (!line || line.time < this.room.latest_message_time) return;
	this.emit('hasread', this.room, line);
	this.queueDraw()
}

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
}

HistoryView.prototype.lastMsgLoaded = function HistoryView_lastMsgLoaded (history) {
	var lastLoadedMsg = history[history.length - 1];
	if (lastLoadedMsg && new Date(lastLoadedMsg.time).getTime() === this.room.latest_message_time)
		return true;
	return false;
}

HistoryView.prototype.onGotHistory = function HistoryView_onGotHistory (direction) {
	this.room.loading = false;
	this.room.empty = false;
	var displayedHistory = this.mode === 'chat' ? this.room.history : this.room.searchHistory;
	this.isFirstMsgLoaded = this.firstMsgLoaded(displayedHistory);
	this.isLastMsgLoaded = this.lastMsgLoaded(displayedHistory);
	if (direction === 'new') this.scrollMode = 'automatic';
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
	if (this.room.id !== room.id) this.messageBuffer = [];
	this.room = room;
	this.scroll.reset(); // reset, otherwise we won't get future events
	if (!msgID) {
		if (!this.room.empty) {
			this.emit('needhistory', room);
		} else {
			this.isFirstMsgLoaded = this.firstMsgLoaded(room.history);
			this.isLastMsgLoaded = this.lastMsgLoaded(room.history);
		}
		this.mode = 'chat';
		this.scrollMode = 'automatic';
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
		classes(el).add('removed');
		setTimeout(function () {
			// vdom seems to bug a bit so remove the class manually
			// otherwise queueDraw() should be enough
			classes(el).remove('removed');
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
}

HistoryView.prototype.toggleInvite = function HistoryView_toggleInvite(ev) {
	this.emit('toggleinvite', qs('.room-header .room-users-wrap'));
};

HistoryView.prototype.showMore = function HistoryView_showMore(ev) {
	var el = closest(ev.target, 'ul', true);
	classes(el).remove('list-previewed');
};

HistoryView.prototype.onInput = function HistoryView_onInput(room, msg, options) {
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
	this.messageBuffer.push(newMessage);
	this.scrollMode = 'automatic';
	this.queueDraw();
	this.handlePendingMsg(newMessage);
}

HistoryView.prototype.onNewMessage = function HistoryView_onNewMessage(line) {
	if (line.channel != this.room || this.mode === 'search') return;
	if (line.author == ui.user) {
		var bufferedMsg = null;
		this.messageBuffer.every(function(message) {
			if (line.clientside_id == message.clientSideID) {
				bufferedMsg = message;
				return false;
			}
			return true;
		});
		if (bufferedMsg) this.messageBuffer.splice(this.messageBuffer.indexOf(bufferedMsg), 1);
	}
	setTimeout(this.queueDraw.bind(this), 200); // give pending msg enough time to complete bubbly effect
}

HistoryView.prototype.onFocusMessage = function HistoryView_onFocusMessage(msgID) {
	this.mode = 'search';
	this.scroll.reset(); // reset, otherwise we won't get future events
	this.scrollMode = 'manual';
	this.requestedMsgID = msgID;
	this.room.loading = false;
	this.isFirstMsgLoaded = this.firstMsgLoaded(this.room.searchHistory);
	this.isLastMsgLoaded = this.lastMsgLoaded(this.room.searchHistory);
	this.redrawTyping();
	this.queueDraw();
}

HistoryView.prototype.resend = function HistoryView_resend(e) {
	var clientSideID = e.target.getAttribute('data-id');
	var bufferedMsg = null;
	this.messageBuffer.every(function(message) {
		if (message.clientSideID == clientSideID) {
			bufferedMsg = message;
			return false;
		}
		return true;
	});
	if (!bufferedMsg) return;
	bufferedMsg.status = "pending";
	this.queueDraw();
	this.handlePendingMsg(bufferedMsg);
}

HistoryView.prototype.handlePendingMsg = function HistoryView_handlePendingMsg(msg) {
	var options = {
		clientside_id: msg.clientSideID,
		attachments: msg.attachments		
	}
	this.emit('send', msg.channel, msg.text, options);

	setTimeout(function() {
		if (this.messageBuffer.indexOf(msg) > -1) {
			msg.status = "unsent";
			this.queueDraw();
		}
	}.bind(this), 10000);
}