/* vim: set shiftwidth=2 tabstop=2 noexpandtab textwidth=80 wrap : */
"use strict";

var Emitter = require('emitter');
var events = require('events');
var inputarea = require('inputarea');
var debounce = require('debounce');
var textcomplete = require('textcomplete');
var qs = require('query');
var query = require('query');
var classes = require('classes');
var template = require('template');
var render = require('../rendervdom');
var attr = require('attr');
var isWebkit = require('../iswebkit');
var markdown_renderlink = require('../markdown_renderlink');
var renderAutocomplete = require('../renderautocomplete');
var staticurl = require('staticurl');
var emoji = require('../emoji');
var MarkdownTipsDialog = require('./dialogs/markdowntips');
var moment = require('moment');

require("startswith");

module.exports = ChatInput;

ChatInput.DELAY = 500;

function ChatInput() {
	Emitter.call(this);
	this.room = null;
	this.max_autocomplete = 12; // maximum of n items
	//this.attachments = [];
	this.init();
	this.bind();
}

ChatInput.prototype = Object.create(Emitter.prototype);

ChatInput.prototype.init = function ChatInput_init() {
	this.redraw();
	this.messageInput = qs('.messageInput', this.el);
	emoji.init_colons();
	this.markdowntipsdialog = new MarkdownTipsDialog().closable();
};

ChatInput.prototype.redraw = function ChatInput_redraw() {
	var vdom = template('chatinput.jade', {});
	render(this, vdom);
};

ChatInput.prototype.bind = function ChatInput_bind() {
	var self = this;

	//bind markdown info
	this.events = events(this.el, this);
	this.events.obj.toggleMarkdownTips = this.toggleMarkdownTips.bind(this);
	this.events.bind('click .markdown-tips', 'toggleMarkdownTips');

	this.complete = textcomplete(this.messageInput, qs('.autocomplete', this.el));
	this.complete_header = document.createElement('ul');
	this.complete_header.setAttribute('class', 'autocomplete-filter-menu')
	this.complete.menu.appendChild(this.complete_header);


	// XXX: textcomplete uses `keydown` to do the completion and calls
	// `stopPropagation()`. But inputarea uses `keyup` to trigger an input.
	// To work around this, we hook up our own `keyup` which is called before
	// inputareas, so we can `stopImmediatePropagation()` the event before it
	// reaches inputarea.
	var isCompleting = false;
	this.complete.on('change', function () {
		isCompleting = true;
	});
	this.messageInput.addEventListener('keyup', function (ev) {
		if (!isCompleting) return;
		ev.stopImmediatePropagation();
		isCompleting = false;
	});
	
	/*
		we will probably have different shortcuts in the future.
		var shortcuts = [
			{ event: 'keydown', callback: editLastMessage },
			...
		]
		then bind each event looping
	*/
	this.messageInput.addEventListener('keydown', function(ev) {
		switch (ev.keyCode) {
			case 37:
				var options = {};
				options.direction = 'left';
				self.navigateFacets(options, ev);
				return;
			case 38:
				self.prepareForEditing.call(this);
				return;
			case 39:
				var options = {};
				options.direction = 'right';
				self.navigateFacets(options, ev);
				return;
		}
	});

	this.complete_header.addEventListener('click', function(e){
		var value = ' #' + unescape(e.target.getAttribute('data-ac'));
		self.update_autocomplete(value);
	});

	this.update_autocomplete = function(value){
		var complete = this.complete;
		if (complete.is_textarea) {
			var el = complete.el;
			var text = el.value;
			var index = el.selectionEnd;
			var start = text.slice(0, index)
				.replace(complete.re, value);
			var new_text = start + text.slice(index);
			el.value = new_text;
			el.setSelectionRange(start.length, start.length)
		} else {
			var node = complete.focusNode;
			var index =  complete.focusOffset;
			var text = node.nodeValue;
			var start = text.slice(0, index)
				.replace(complete.re, value);
			var new_text =  start + text.slice(index);
			node.textContent = new_text;
		}
		self.moveCaretToEnd(self.messageInput);
	}

	// if the user presses up arrow while the autocomplete is not showing
	// then get the last loaded message of the user
	// and prepare it for editing
	// check for attachments since it is not possible to
	// edit attachments
	this.prepareForEditing = function() {
		if (!self.complete.shown && this.innerText.length == 0) {
			var ascendingHistory = self.room.history.slice();
			ascendingHistory.reverse();
			ascendingHistory.some(function(msg) {
				if (msg.author == ui.user && msg.attachments.length == 0) {
					var msgEl = query("div.message[data-id='" + msg.id + "']");
					classes(msgEl).add('editing');
					self.editMessage(msg);
					return true;
				}
				return false;
			});
		}
	};

	// TODO: we SO need a subclass of Textcomplete
	// which handles all the facets menu logic
	// it could be called FacettedTextcomplete
	this.navigateFacets = function(options, ev) {
		if (!self.complete.shown) return;
		ev.preventDefault();
		ev.stopPropagation();		
		var facets = query.all('li.facet', self.complete_header),
				limit = (options.direction == 'left') ? 0 : facets.length - 1,
				activeFacet = query('a.active', self.complete.header).parentElement,
				activeFacetPos;
		for (var i = 0; i < facets.length; ++i) {
			if (facets[i] == activeFacet) {
				activeFacetPos = i;
				break;
			}
		}
		if (activeFacetPos == limit) return;
		(options.direction == 'left') ? activeFacetPos-- : activeFacetPos++;
		activeFacet = facets[activeFacetPos];
		self.update_autocomplete("#" + unescape(activeFacet.children[0].getAttribute('data-ac')));
	};


	// hook up the input
	this.input = inputarea(this.messageInput);
	this.input.cleanedValue = function() {
		var el = this.el;
		var children = [];
		for(var child in el.childNodes) {
			var childnode = el.childNodes[child];
			// check if it is a google content. If so, un wrap it from the wrapping <ol>
			// then process the content normally
			if(childnode.nodeName === "OL" && typeof childnode.childNodes !== 'undefined'
			&& childnode.childNodes.length == 1){
				childnode = childnode.childNodes[0];
			}
			// check if there are some contents in wrapped in a big <div>. If so, handle
			// the inner contents
			// else, clean the current elment
			if(childnode.childNodes && childnode.childNodes.length > 1){
				// check if it is not an emoji or autocomplete item. If so, don't split the elment
				// as the autocomplete item will be lost, else, continue normally
				if(childnode.nodeType === 1 && childnode.getAttribute('data-object') !== null){
					children = children.concat(self.cleanNode(childnode));
				} else{
					for(var subchild in childnode.childNodes){
					children = children.concat(self.cleanNode(childnode.childNodes[subchild]));
					}
				}

			} else{
				children = children.concat(self.cleanNode(childnode));
			}
		}
		return children.join('');
	};
	this.input.on('input', function (str) {
		str = str.trim();
		if (!str)
			return;
		doStop();
		if (!self.editing) {
			self.emit('input', self.room, str/*, {
				attachments: self.attachments
			}*/);
			//self.attachments = [];
		} else {
			self.emit('update', self.editMsg, str);
			self.editingDone();
		}
	});

	// // make the messageInput auto resize
	// var resize = debounce(function() {
	//	resizable(self.messageInput, {min: 31, max: 220})}, delay);
	// resize();

	// Emitter(this.messageInput);
	// this.messageInput.on('resize', function(diff) {
	//	// resize footer height
	//	var footer = closest(self.messageInput, 'footer');
	//	var new_height = footer.clientHeight + diff;
	//	footer.style.height =  new_height + 'px';

	//	// resize chat wrapper padding
	//	var wrapper = qs(".chat-wrapper");
	//	var new_padding_bottom = parseInt(style(wrapper).paddingBottom) + diff;
	//	wrapper.style.paddingBottom =  new_padding_bottom + 'px';
	// });

	// emit typing (start and stop) events
	var delay = ChatInput.DELAY;
	var stopped = false;
	var start = debounce(function () {
		stopped = false;
		self.emit('starttyping', self.room);
	}, delay, true);
	function doStop() {
		if (stopped) return;
		stopped = true;
		self.emit('stoptyping', self.room);
	}
	var stop = debounce(doStop, delay);
	this.messageInput.addEventListener('keypress', function () {
		start();
		stop();
	});

	document.addEventListener('keyup', function (ev) {
		if (!self.editing) return;
		if (ev.keyCode === 27) self.editingDone();
	});

	// google chrome and other webkit browsers need this:
	// https://stackoverflow.com/questions/17890568/contenteditable-div-backspace-and-deleting-text-node-problems
	if (isWebkit()) {
		this.messageInput.contentEditable = "plaintext-only";
	}

	// hook up the autocomplete
	// there should always be a whitespace char in front, or beginning of line. hence (^|\s)
	// the regex should only match terms that contain spaces or nbsp;s
	// note: content editale seems to turn nbsp;s at the end of the text into
	// normal spaces when continuing to type
	this.complete.re = /(^|\s)([@#:])(([^\s]+[ \u00a0]?){1,3})$/;
	this.complete.formatSelection = function (obj) {
		return obj.whitespace +  renderAutocomplete(obj, true);
	};
	this.complete.query = function (matches) {
		var whitespace = matches[1];
		var trigger_character = matches[2];
		var match = matches[3];

		self.complete.clear();

		if (trigger_character === ':') {
			self.complete_header.innerHTML = "";

			if (match[match.length-1] === ':') {
				// match without ':' at the end
				match = match.substr(1, match.length-1);
			}

			match = match.toLowerCase();

			// TODO: app.organization
			var custom_emojis = app.organization.custom_emojis;
			for (var emo in custom_emojis) {
				if (self.complete.options.length >= self.max_autocomplete)
					break;
				if (custom_emojis.hasOwnProperty(emo)) {
					if (~emo.indexOf(match)) {
						var image = '<img src="'+custom_emojis[emo]+'" class="emoji" alt="'+emo+'">';
						self.complete.push({
							id: ":" + emo + ":",
							title: "<div class='entry-type-description'>Emoji</div>" + "<div class='option-wrap'>" + image + " :" + emo + ":" + "</div>",
							insert: image,
							service: "emoji",
							type: "emoji",
							whitespace: whitespace
						});
					}
				}

			}

			var emojis = emoji.map.colons;
			for (var emo in emojis) {
				if (self.complete.options.length >= self.max_autocomplete)
					break;
				if (emojis.hasOwnProperty(emo)) {
					var val = emojis[emo];
					if (~emo.indexOf(match)) {
						var image = emoji.replacement(val, emo, ':');
						self.complete.push({
							id: ":" + emo + ":",
							title: "<div class='entry-type-description'>Emoji</div>" + "<div class='option-wrap'>" + image + " :" + emo + ":" + "</div>",
							insert: image,
							service: "emoji",
							type: "emoji",
							whitespace: whitespace
						});
					}
				}
			}

			if (self.complete.options.length > 0) {
				self.complete.show();
				self.complete.highlight(0);
			}

		} else if (trigger_character === "@") {
			// show users and rooms, we have them locally.
			// naive search: loop through all of them,
			// hopefully there are not too many

			// TODO don't use global vars

			self.complete_header.innerHTML = "";

			var users = app.organization.users;
			var search = match;
			for (var i=0; i<users.length; i++) {
				if (self.complete.options.length >= self.max_autocomplete)
					break;
				var user = users[i];
				if (  user.firstName.startsWithIgnoreCase(search)
					 || user.lastName.startsWithIgnoreCase(search)
					 || user.username.startsWithIgnoreCase(search)) {
					var name = "";
					var full_name_class = "";
					if (user.firstName !== "") {
						name += user.firstName;
						if (user.lastName !== "") {
							name += " " + user.lastName;
						}
						full_name_class = "full_name_true";
					} else {
						name = user.username;
						full_name_class = "full_name_false";
					}

					self.complete.push({
						id: "[" + name + "](cg://chatgrape|user|" + user.id + "|/chat/@" + user.username + ")",
						title: '<div class="entry-type-description">Member</div>' + '<div class="option-wrap ' + full_name_class +'">' + '<img src="' + user.avatar + '" width="16" alt="Avatar of ' + user.firstName + ' ' + user.lastName + '" style="border-radius:50%;margin-bottom:-3px;"/>&nbsp;' + user.firstName + ' ' + user.lastName + ' <em>' + user.username + '</em></div>',
						insert: '@' + name,
						service: 'chatgrape',
						type: 'user',
						url: '/chat/@' + user.username,
						whitespace: whitespace
					});
				}
			}

			var rooms = app.organization.rooms;
			for (var i=0; i<rooms.length; i++) {
				if (self.complete.options.length >= self.max_autocomplete)
					break;
				var room = rooms[i];
				if (room.name.startsWithIgnoreCase(search)) {
					self.complete.push({
						id: "[" + room.name + "](cg://chatgrape|room|" + room.id + "|/chat/" + room.slug + ")",
						title: '<div class="entry-type-description">Room</div>' + '<div class="option-wrap"><span class="entry-type-icon type-chatgraperoom"></span> ' + room.name + '</div>',
						insert: '@' + room.name,
						service: 'chatgrape',
						type: 'room',
						url: '/chat/' + room.name,
						whitespace: whitespace
					});
				}
			}

			if (self.complete.options.length > 0) {
				self.complete.show();
				self.complete.highlight(0);
			}

		} else if (trigger_character === "#") {
			// send autocomplete request to server, we don't have the data locally

			self.emit('autocomplete', match, function autocomplete_callback(err, data){
				if (!data || !data.results) {
					console.log(arguments);
					self.complete_header.innerHTML = "";
					self.complete.hide();				
					return;
				}
				
				if (data.search.type == 'external'){
					/*
					External search is here!
					 */
					data.results.forEach(function(r, i){
						self.complete.push({
							id: r.id,
							title: r.name || r.source,
							insert: r.url,
							service: r.service,
							type: r.type,
							url: r.url,
							whitespace: whitespace
						})
					})
					if (self.complete.options.length > 0) {
						self.complete.show();
						self.complete.highlight(0);
					}
					return;
				};
				
				if (data.services){
						var querySearch = data.search.text ? escape(data.search.text) : '';
						var facet_header = '<li class="facet" ><a href="javascript:void(0);" data-ac="'+ querySearch +'"><i class="fa fa-caret-square-o-left"></i><span class="facet-all">All</span></a></li>';
						var services = {}

						data.services.forEach(function(service, i){
							services[service.name] = {
								count: service.count,
								results: [],
							}
							
							facet_header +='<li class="facet service"><a href="javascript:void(0);" data-ac="' + service.key + escape(':') + querySearch + '">' + service.label + ' (' + service.count + ')</li>'
						})
					self.complete_header.innerHTML = facet_header;
					var activeFacet = query('a[data-ac="'+ escape(self.messageInput.innerText.substring(1)) +'"]', self.complete_header);
					if (activeFacet) classes(activeFacet).add('active');
				} else {
					self.complete_header.innerHTML = "";
				}

				var results = data.results;

				var grouped_results = {};

				grouped_results['Top Result'] = [];
				grouped_results['Top Result'].push(results.shift());

				results.forEach(function(result){
					if (typeof grouped_results[result.service] === 'undefined') {
						grouped_results[result.service] = [];
					}
					grouped_results[result.service].push(result);
				});

				for (var prop in grouped_results) {
					if(grouped_results.hasOwnProperty(prop)){
						var group_name = prop;
						var group = grouped_results[prop];
						for (var j=0; j<group.length; j++) {
							var r = group[j];
							var type = "";
							var title = "";
							if (r.start) {
								title = '<div class="entry-type-description">' + r.service + ' ' + r.type + '</div>' + '<div class="option-wrap"><span class="entry-type-icon service-' + r.service + ' type-' + r.service + r.type +'"></span>' + r.highlighted + ' <em class="entry-additional-info">' + r.container + '</em><time datetime="' + r.start + '">' + moment(r.start).format('lll') + '</time></div>';
							} else {
								type = r.service == "googledrive" ? "" : r.type;
								title = '<div class="entry-type-description">' + r.service + ' ' + type + '</div>' + '<div class="option-wrap"><span class="entry-type-icon service-' + r.service + ' type-' + r.service + r.type +'"></span>' + r.highlighted + ' <em class="entry-additional-info">' + r.container + '</em></div>';
							}
							if (j === 0) {
								title = '<div class="group">' + group_name + '</div>' + title;
							}
							self.complete.push({
								id: "[" + r.name + "](cg://" + r.service + "|" + r.type + "|" + r.id + "|" + r.url + "||)",
								title: title,
								insert: r.name,
								service: r.service,
								type: r.type,
								url: r.url,
								whitespace: whitespace
							});
						}
					}
				}
				
				if (data.search.queries) {
					data.search.queries.forEach(function(r, i){
						self.complete.push({
							id: r.id,
							title: r.name,
							insert: '#' + r.query,
							whitespace: whitespace
						})
					})
				}

				if (self.complete.options.length > 0) {
					self.complete.show();
					self.complete.highlight(0);
				}
			});
		}
	};
};

ChatInput.prototype.parseDate = function ChatInput_parseDate (data) {
	if(typeof lang !== "undefined")
			Date.i18n.setLanguage(lang);

	//replace(/([A-Za-z])\.+/g, '$1').split(/\s+/);
	var lookahead = 3;
	var self = this;

	//split into sentences
	//str.replace(/([.?!])\s*(?=[A-Z])/, "$1|").split("|")

	var re = new RegExp(/[.!?]+(?!\d)|([^\d])[.?!]+(?=\d)/g);
	var sentRe = data.replace(re,"$1|");
	var sentences = sentRe.split("|");

	//var sentences = data.split();//, "$1|").split("|");
	//var sentences = str.replace(/\.(?!\d)|([^\d])\.(?=\d)/g,'$1.|');

	//for each sentence
	for (var s=0; s < sentences.length; s++) {
			//split into words
			var words = sentences[s].replace(/[^\w\s:]|_/g, " ")
					.replace(/\s+/g, " ")
					.trim()
					.split(/\s+/);

			//analyze all combinations of up to $lookahead consecutive words
			for (var i = 0; i < words.length; i++) {
					var found = false,
							date = null,
							phrase = null,
							last = null;
					for (var j = i + 1; j < i + lookahead + 1 && j < words.length + 1; j++) {
							var _phrase = words.slice(i, j).join(' ');
							var _date;
							if (_date = Date.parse(_phrase)) {
									date = _date;
									phrase = _phrase;
									found = true;
									last = j - 1;
							}
					}
					if (found) {
							self.emit('autocompletedate', data, function autocomplete_callback(err, result){
								for (var i=0; i<result.length; i++) {
									if (self.complete.options.length >= self.max_autocomplete)
										break;
									var r = result[i];
									self.complete.push({
										id: "[" + r.name + "](cg://" + r.service + "|" + r.type + "|" + r.id + "|" + r.url + "||)",
										title: '<div class="entry-type-description">' + r.service + ' ' + r.type + '</div>' + '<div class="option-wrap"><span class="entry-type-icon service-' + r.service + ' type-' + r.service + r.type +'"></span>' + r.name + ' <em class="entry-additional-info">' + r.container + '</em></div>',
										insert: r.name,
										service: r.service,
										type: r.type,
										url: r.url,
										// whitespace: whitespace
									});
								}

								if (self.complete.options.length > 0) {
									self.complete.show();
									self.complete.highlight(0);
								}
							});
							// move the index to behind found phrase and break
							i = last;
							//break;
					}
			}
	}
};

ChatInput.prototype.setRoom = function ChatInput_setRoom(room) {
	this.room = room;
	attr(this.messageInput).set('disabled', !room);
	if (room) this.messageInput.removeAttribute('disabled'); // IE :)
	if (room) this.messageInput.focus();
	if (this.editing) this.editingDone();
};

ChatInput.prototype.moveCaretToEnd = function ChatInput_moveCaretToEnd(el) {
	el.focus();
	if (typeof window.getSelection !== "undefined"
			&& typeof document.createRange !== "undefined") {
		var range = document.createRange();
		range.selectNodeContents(el);
		range.collapse(false);
		var sel = window.getSelection();
		sel.removeAllRanges();
		sel.addRange(range);
	} else if (typeof document.body.createTextRange !== "undefined") {
		var textRange = document.body.createTextRange();
		textRange.moveToElementText(el);
		textRange.collapse(false);
		textRange.select();
	}
};

ChatInput.prototype.editMessage = function ChatInput_editMessage(msg) {
	this.editMsg = msg;
	this.editing = true;
	classes(this.el).add('editing');
	this.oldVal = this.messageInput.innerHTML;
	var message_text = msg.text;

	// replace special autocomplete links with html
	var autocomplete = /\[((?:\[[^\]]*\]|[^\[\]]|\](?=[^\[]*\]))*)\]\(\s*(cg\:[\s\S]*?)\s*\)/gm;
	var replacer = function replacer(match, text, href){
		return markdown_renderlink(href, "", text, true);
	};
	message_text = message_text.replace(autocomplete, replacer);

	// replace linebreaks with <br>s
	message_text = message_text.replace(/\n/gm, "<br>");

	this.messageInput.innerHTML = message_text;
	this.messageInput.focus();
	this.moveCaretToEnd(this.messageInput);
};

ChatInput.prototype.editingDone = function ChatInput_editingDone() {
	this.emit('editingdone', this.editMsg);
	this.editing = false;
	if ( this.editMsg ) this.messageInput.innerHTML = this.oldVal;
	this.oldVal = null;
	this.editMsg = null;
	classes(this.el).remove('editing');
	this.messageInput.focus();
};

ChatInput.prototype.cleanNode = function ChatInput_cleanNode(childnode) {
	// clean an input element
	var children = [];
	// check if the element is any thing other than text and objects, e.g. iterator function
	if(typeof childnode.nodeName === 'undefined' && typeof childnode.nodeType === 'undefined'){
		return[];
	}
	// if the elment is one of the following tags, insert new line
	if(childnode.nodeName && (childnode.nodeName === "BR"
	|| childnode.nodeName === "DIV" || childnode.nodeName === "P"
	|| childnode.nodeName === "LI" || childnode.nodeName === "UL")){
		children.push("\n");
	}
	if (childnode.nodeType === 3) {
		children.push(childnode.nodeValue);
	} else if (childnode.nodeType === 1) {
		// we don't use attr() here because it loops through all
		// attributes when it doesn't find the attribute with
		// getAttribute. So this won't work in old IEs, but it's faster
		var object = childnode.getAttribute('data-object');
		if (object !== null) {
			children.push(object);
		} else {
			// Q: why would there be any HTML in the message input?
			// A: pasting content
			children.push(childnode.textContent);
		}
	} else if (childnode.textContent){
		children.push(childnode.textContent);
	} else if(childnode.nodeName === "IMG"){
		children.push("[IMG]\n");
		children.push(childnode.src);
	}
	return children;
};

/*
ChatInput.prototype.addAttachment = function ChatInput_addAttachment(attachment) {
	this.attachments.push(attachment.id);
};
*/

ChatInput.prototype.toggleMarkdownTips = function ChatInput_toggleMarkdownTips(ev) {
	ev.preventDefault();
	this.markdowntipsdialog.overlay().show();
}
