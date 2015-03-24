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
	this.router.on(/^\/chat\/(@+)/, selectPM);
	this.router.on(/^\/chat\/([^@]+)/, selectRoom);
	this.router.listen();

	var router = this.router;

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
		if (chosenRoom.joined) return emit('selectchannel', chosenRoom);
		emit('joinroom', chosenRoom, function() {
			emit('selectchannel', chosenRoom);
		});		
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
		if (chosenPM.pm) return emit('selectchannel', chosenPM.pm);
		emit('openpm', chosenPM, function() {
			emit('selectchannel', chosenPM.pm);
		});			
	}

}