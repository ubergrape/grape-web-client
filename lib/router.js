var Router = require('router');

module.exports = URLManager;

function URLManager() {

	this.router = new Router();
	this.router.on(/^\/chat\/($)/, pickChannel.bind(this));
	this.router.on(/^\/chat\/\@([^\/]+)$/, selectPM.bind(this), goToPM.bind(this));
	this.router.on(/^\/chat\/\@([^\/]+)\/(.)*/, selectPM.bind(this), goToPM.bind(this));
	this.router.on(/^\/chat\/([^@\/]+)$/, selectRoom.bind(this), goToRoom.bind(this));
	this.router.on(/^\/chat\/([^@\/]+)\/(.)*/, selectRoom.bind(this), goToRoom.bind(this));
	this.router.listen();

	var cUser = this.user;

	function pickChannel(context, next) {
		var	redirectRoom = false,
			redirectSlug = false;

		this.navigation.roomList.items.every(function(room) {
			if (room.joined) {
				redirectRoom = room;
				return false;
			}
			return true;
		});

		if (redirectRoom) {
			context.selectRoom = redirectRoom;
			redirectSlug = redirectRoom.slug;
			goToRoom.call(this, context);
		} else {
			redirectRoom = this.navigation.pmList.items[0];
			redirectSlug = redirectRoom.username.toLowerCase();
			context.selectPM = redirectRoom;
			goToPM.call(this, context);			
		}

		this.router.replace('/chat/' + redirectSlug);
	};

	function selectRoom(context, next) {
		var	splitPath = context.path.split('/'),
			slug = splitPath[2].toLowerCase(),
			chosenRoom = false;

		this.org.rooms.every(function(room) {
			if(room.slug == slug) {
				chosenRoom = room;
				return false;
			} else {
				return true;
			}
		});
		smartRedirect.call(this, chosenRoom, splitPath, chosenRoom.slug);
		context.selectRoom = chosenRoom;
		if (next) next();
	};

	function selectPM(context, next) {
		var splitPath = context.path.split('/'),
			slug = splitPath[2],
			username = slug.substr(1),
			chosenPM = false;

		this.org.users.every(function(user) {
			if(user.username.toLowerCase() == username
				&& cUser.username != username) {
				chosenPM = user;
				return false;
			} else {
				return true;
			}
		});
		smartRedirect.call(this, chosenPM, splitPath, slug);
		context.selectPM = chosenPM;
		if (next) next();
		
	};

	// well, it is not that smart atm
	// but phteven suggested levenshtein distance
	// for routing suggestions in the warning message in the future
	function smartRedirect(channel, splitPath, slug) {
		if (!channel) {
			this.router.go('/chat/');
			setTimeout(function () {
				var msg = this.messages.warning('url not found');
				setTimeout(function() {
					msg.remove();
				}, 6000);
			}.bind(this), 500);
		}
		if (channel && splitPath.length > 3) {
			this.router.go('/chat/' + slug);
		}	
	};

	function goToRoom(context) {
		var chosenRoom = context.selectRoom;
		if (chosenRoom.joined) return this.emit('selectchannel', chosenRoom);
		this.emit('joinroom', chosenRoom, function() {
			this.emit('selectchannel', chosenRoom);
		}.bind(this));
	};

	function goToPM(context) {
		var chosenPM = context.selectPM;
		if (chosenPM.pm) return this.emit('selectchannel', chosenPM.pm);
		this.emit('openpm', chosenPM, function() {
			this.emit('selectchannel', chosenPM.pm);
		}.bind(this));
	};
}