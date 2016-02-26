let Emitter = require('emitter')
let notify = require('HTML5-Desktop-Notifications')
let _ = require('t')
let markdown = require('../markdown')
let domify = require('domify')
let staticurl = require('staticurl')
let emoji = require('../emoji')

module.exports = Notifications

function Notifications() {
  this.show = false
  this.room = new Emitter({name: '', users: []})
  this.init()
}

Notifications.prototype = Object.create(Emitter.prototype)

Notifications.prototype.init = function Notifications_init() {
  notify.config({
    pageVisibility: true,
    autoClose: 6000
  })
}

Notifications.prototype.setRoom = function Notifications_setRoom (room) {
  this.room = room
}

Notifications.prototype.onNewInviteNotification = function Notification_onNewInviteNotification (item) {
  let inviter = item.inviter
  let room = item.room
  let content = inviter.displayName + _(' invited you to the group ') + room.name
  let title = inviter.displayName + _(' (Group Invite)')
  let icon = inviter.avatar
  this.dispatch(title, content, icon, room)
}
Notifications.prototype.onNewMsgNotification = function Notifications_onNewMsgNotification (notif) {
  let i, opts, title, content_dom, imgs, img, replacement, filename
  let content = notif.content
  let attachments = notif.attachments
  let hasExpired  = (new Date() - notif.time)/1000 > 60

  // don't notify if:
  // - message is too old - to prevent old msgs avalanche when server reloads or device resumes from standby
  // - chat is focused on the room the notification comes from
  if ((notif.channel.id === this.room.id && document.hasFocus()) || hasExpired) return

  if (notif.channel.type === 'room') {
    title = notif.author.name + ' (' + notif.channel.name + ')'
  } else {
    title = notif.author.name + ' (' + _('Private message') + ')'
  }

  // parse markdown
  if (content) {
    opts = {
      emoji: function (emo) {
        emoji.init_colons()
        // we can't display custom emojis here because we only have them as images, they will automatically be displayed as :xyz:
        let val = emoji.map.colons[emo]
        return val ? emoji.data[val][0][0] : ':' + emo + ':'
      }
    }
    // build dom from parsed markdown message
    content_dom = domify(markdown(content, opts))

    // replace images
    imgs = content_dom.getElementsByTagName('img')
    replacement = document.createElement("p")
    replacement.innerHTML = _('[Image]')
    for (i=0; i<imgs.length; i++) {
      img = imgs[i]
      img.parentElement.replaceChild(replacement, img)
    }

    // strip html
    content = content_dom.textContent || content_dom.innerText || ""
  }

  // remove "[Image]" for service connections
  if (notif.author.type === "service") content.replace("[Image]", "")

  // attach files
  if (typeof attachments !== "undefined" && attachments.length > 0) {
    // currently the client doesn't supprt text content AND attachment
    // but the API supports it
    if (typeof content !== "undefined" && content !== "") content += "\n\n"
    // add the filenames to the notification
    // currently the client only allows to add one attachment
    // but the API supports multiple
    for(i=0; i<attachments.length; i++) {
      filename = attachments[i].name
      if (typeof filename !== "undefined" && filename !== "") {
        content += filename
        if (i<attachments.length-1) {
          content + "\n"
        }
      }
    }
  }

  this.dispatch(title, content, notif.author.icon_url, notif.channel)
}

Notifications.prototype.dispatch = function Notifications_dispatch (title, content, icon, channel) {
  let self = this
  if (window.MacGap) {
    window.MacGap.notify({
      title: title,
      content: content,
      sound: false
    })
  } else {
    let notification = notify.createNotification(title, {
      body: content,
      icon: icon,
      timeout: 6000,
      onclick: function (ev) {
        self.emit('notificationClicked', channel)
        window.focus()
        notification.close()
      }
    })
  }
}
