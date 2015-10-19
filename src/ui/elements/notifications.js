/* vim: set shiftwidth=2 tabstop=2 noexpandtab textwidth=80 wrap : */
"use strict";

var Emitter = require('emitter');
var notify = require('HTML5-Desktop-Notifications');
var _ = require('t');
var markdown = require('../markdown');
var domify = require('domify');
var staticurl = require('staticurl');
var emoji = require('../emoji');

module.exports = Notifications;

function Notifications() {
  this.show = false;
  this.room = new Emitter({name: '', users: []});
  this.init();
}

Notifications.prototype = Object.create(Emitter.prototype);

Notifications.prototype.init = function Notifications_init() {
  notify.config({
    pageVisibility: true,
    autoClose: 6000
  });
};

Notifications.prototype.setRoom = function Notifications_setRoom (room) {
  this.room = room;
};

Notifications.prototype.onNewInviteNotification = function Notification_onNewInviteNotification (item) {
  var inviter = item.inviter;
  var room = item.room;
  var content = inviter.displayName + _(' invited you to the room ') + room.name;
  var title = inviter.displayName + _(' (Room Invite)');
  var icon = inviter.avatar;
  this.dispatch(title, content, icon, room);
}

Notifications.prototype.onNewMsgNotification = function Notifications_onNewMsgNotification (message) {
  var self = this;
  var i, opts, content_dom, imgs, img, replacement, filename;
  var  author    = message.author,
    channel    = message.channel,
    isService  = author.type === 'service',
    icon    = isService ? staticurl("images/service-icons/" + author.id + "-64.png") : author.avatar,
    authorName  = isService ? author.username : author.displayName,
    content   = isService ? message.title : message.text,
    type     = channel.type === 'room' ? channel.name : _('Private message'),
    title    = authorName + ' (' + type + ')',
    hasExpired  = (new Date() - message.time)/1000 > 60;

  // don't notify if:
  // - message is too old - to prevent old msgs avalanche when server reloads or device resumes from standby
  // - chat is focused on the room the notification comes from
  if ((channel.id === this.room.id && document.hasFocus()) || hasExpired) return;

  // parse markdown
  if (typeof content !== "undefined" && content !== "") {
    opts = {
      emoji: function (emo) {
        emoji.init_colons();
        // we can't display custom emojis here because we only have them as images, they will automatically be displayed as :xyz:
        var val = emoji.map.colons[emo];
        return val ? emoji.data[val][0][0] : ':' + emo + ':';
      }
    };
    content_dom = domify(markdown(content, opts));

    // replace images
    imgs = content_dom.getElementsByTagName('img');
    replacement = document.createElement("p");
    replacement.innerHTML = _('[Image]');
    for (i=0; i<imgs.length; i++) {
      img = imgs[i];
      img.parentElement.replaceChild(replacement, img);
    }

    // strip html
    content = content_dom.textContent || content_dom.innerText || "";
  }

  // remove "[Image]" for service connections
  if (author.type === "service") content.replace("[Image]", "");

  // attach files
  var attachments = message.attachments;
  if (typeof attachments !== "undefined" && attachments.length > 0) {
    // currently the client doesn't supprt text content AND attachment
    // but the API supports it
    if (typeof content !== "undefined" && content !== "") content += "\n\n";
    // add the filenames to the notification
    // currently the client only allows to add one attachment
    // but the API supports multiple
    for(i=0; i<attachments.length; i++) {
      filename = attachments[i].name;
      if (typeof filename !== "undefined" && filename !== "") {
        content += filename;
        if (i<attachments.length-1) {
          content + "\n";
        }
      }
    }
  }

  this.dispatch(title, content, icon, channel);
};

Notifications.prototype.dispatch = function Notifications_dispatch (title, content, icon, channel) {
  var self = this;
  if (typeof MacGap !== 'undefined') {
    MacGap.notify({
      title: title,
      content: content,
      sound: false
    });
  } else {
    var notification = notify.createNotification(title, {
      body: content,
      icon: icon,
      timeout: 6000,
      onclick: function(ev) {
        self.emit('notificationClicked', channel);
        window.focus();
        notification.close();
      }
    });
  }
}