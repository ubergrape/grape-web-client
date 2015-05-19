var page = require('page');

module.exports = Router;

function Router(ui) {
	
	var baseURL	= '/chat',
		cUser	= ui.user;

	page.base(baseURL);
	page('/', pickChannel);
	page('/@:pm', goToPM);
	page('/:room', goToRoom);
	page('/@:pm/:message', goToPM);
	page('/:room/:message', goToRoom);
	page('*', notFound);
	page();

	function pickChannel () {
		var	redirectRoom = false;

		ui.navigation.roomList.items.every(function(room) {
			if (room.joined) {
				redirectRoom = room;
				return false;
			}
			return true;
		});

		var redirectSlug = redirectRoom ? redirectRoom.slug : '@' + ui.navigation.pmList.items[0].username.toLowerCase();
		page.replace(baseURL + '/' + redirectSlug);
	
	}

	function goToPM (cxt) {
		var username	= cxt.params.pm,
			chosenPM	= selectPM(username);
		if (chosenPM) {
			if (chosenPM.pm) return ui.emit('selectchannel', chosenPM.pm);
			ui.emit('openpm', chosenPM, function() {
				ui.emit('selectchannel', chosenPM.pm);
			});
		} else {
			notFound();
		}
	}

	function selectPM (username) {
		var chosenPM = false;
		ui.org.users.every(function(user) {
			if(user.username.toLowerCase() == username
				&& cUser.username != username) {
				chosenPM = user;
				return false;
			} else {
				return true;
			}
		});
		return chosenPM;
	}

	function goToRoom (cxt) {
		var	slug 		= cxt.params.room,
			chosenRoom	= selectRoom(slug);
		if (chosenRoom) {
			if (chosenRoom.joined) return ui.emit('selectchannel', chosenRoom);
			ui.emit('joinroom', chosenRoom, function() {
				ui.emit('selectchannel', chosenRoom);
			});
		} else {
			notFound();
		}
	}

	function selectRoom (slug) {
		var chosenRoom = false;
		ui.org.rooms.every(function(room) {
			if(room.slug == slug) {
				chosenRoom = room;
				return false;
			} else {
				return true;
			}
		});
		return chosenRoom;
	}

	function notFound() {
		page.replace(baseURL + '/');
		setTimeout(function () {
			var msg = ui.messages.warning('url not found');
			setTimeout(function() {
				msg.remove();
			}, 6000);
		}, 500);
	}

}