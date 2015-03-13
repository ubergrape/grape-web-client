var Router = require('router');

module.exports = URLManager;

function URLManager() {

	var	rooms		= this.org.rooms,
		emit		= this.emit.bind(this),
		pathPrefix	= this.options.pathPrefix,
		users		= this.org.users,
		pms			= this.org.pms,
		cUser		= this.user;

	this.router = new Router();
	this.router.on('/chat/:channel', selectChannel);
	this.router.start();

	function selectChannel(context, next) {
		// this will actually return a channel or a user

		var channel = channelFromURL(context.path);

		function addlistener(pm) {
			if (pm.users[0] !== channel) return;
			pms.off('add', addlistener);
			emit('selectchannel', pm);
		}

		if (channel) {
			if (channel.type === "room") {
				if (!channel.joined) {
					emit('joinroom', channel, function() {
						emit('selectchannel', channel);
					});
				} else {
					emit('selectchannel', channel);
				}
			} else {
				selectPM(channel);
			}
		}
	}

	function channelFromURL(path) {
		path = path || location.pathname;
		var pathRegexp = new RegExp((pathPrefix || '') + '/?(@?)(.*?)/?$');
		var match = path.match(pathRegexp);
		var i;
		// if there is no match, go to "General"
		// if there is no "general" room, go to first room
		// if there is no room at all, we are doomed
		if (!match || !match[2]) {
			for (i = 0; i < rooms.length; i++) {
				var room = rooms[i];
				if (room.name === "General") {
					return room;
				}
			}
			return rooms[0];
		}
		var name = match[2].toLowerCase();
		if (match[1] === '@' && name !== cUser.username) {
			// there'sno channel with yourself
			// match users
			for (i = 0; i < users.length; i++) {
				var user = users[i];
				if (user.username.toLowerCase() === name)
					return user;
			}
		} else {
			// match rooms
			for (i = 0; i < rooms.length; i++) {
				var room = rooms[i];
				if (room.slug === name)
					return room;
			}
		}
	}

	function selectPM(user) {
		if (user.pm === null) {
			emit('openpm', user, function() {
				emit('selectchannel', user.pm);
			});
		} else {
			emit('selectchannel', user.pm);
		}
	}
}