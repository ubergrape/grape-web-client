var Router = require('router');

module.exports = URLManager;

function URLManager() {

	var	rooms		= this.org.rooms,
		emit		= this.emit.bind(this),
		pathPrefix	= this.options.pathPrefix,
		users		= this.org.users,
		pms			= this.org.pms,
		cUser		= this.user,
		roomList	= this.navigation.roomList,
		pmList		= this.navigation.pmList;

	this.router = new Router();
	this.router.on(/^\/chat\/($)/, pickChannel);
	this.router.on(/^\/chat\/(@+)/, selectPM, goToPM);
	this.router.on(/^\/chat\/([^@]+)/, selectRoom, goToRoom);
	this.router.listen();

	var router = this.router;

	function pickChannel(context, next) {
		var redirectRoom = false;
		roomList.items.every(function(room) {
			if (room.joined) {
				redirectRoom = room;
				return false;
			}
			return true;
		});
		if (redirectRoom) {
			emit('selectchannel', redirectRoom);
		} else {
			redirectRoom = pmList.items[0];
			context.selectPM = redirectRoom;
			goToPM(context);			
		}
	}

	function selectRoom(context, next) {
		var	parsedPath = context.path.split(pathPrefix),
			slug = parsedPath[parsedPath.length - 1].toLowerCase(),
			chosenRoom = false;

		rooms.every(function(room) {
			if(room.slug == slug) {
				chosenRoom = room;
				return false;
			} else {
				return true;
			}
		});
		//if (!chosenRoom) return router.go('/chat/not-found');
		context.selectRoom = chosenRoom;
		if (next) next();
	}

	function selectPM(context, next) {
		var username = context.path.split('/@')[1],
			chosenPM = false;

		users.every(function(user) {
			if(user.username.toLowerCase() == username
				&& cUser.username != username) {
				chosenPM = user;
				return false;
			} else {
				return true;
			}
		});
		//if (!chosenPM) return router.go('/chat/not-found');
		context.selectPM = chosenPM;
		if (next) next();
		
	}

	function goToRoom(context) {
		var chosenRoom = context.selectRoom;
		if (chosenRoom.joined) return emit('selectchannel', chosenRoom);
		emit('joinroom', chosenRoom, function() {
			emit('selectchannel', chosenRoom);
		});	
	}

	function goToPM(context) {
		var chosenPM = context.selectPM;
		if (chosenPM.pm) return emit('selectchannel', chosenPM.pm);
		emit('openpm', chosenPM, function() {
			emit('selectchannel', chosenPM.pm);
		});
	}
}