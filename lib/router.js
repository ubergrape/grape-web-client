var page = require('page');

module.exports = Router;

function Router(ui) {
	
	var baseURL	= '/chat',
		cUser	= ui.user;

	page.base(baseURL);
	page('/', pickChannel);
	page('/@:pm', selectPM);
	page('/:room', selectRoom);
	page('*', redirect);
	page();

	function pickChannel () {
		console.log('ROOM');
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

	function selectPM (cxt) {
		var username	= cxt.params.pm,
			chosenPM	= false;

		ui.org.users.every(function(user) {
			if(user.username.toLowerCase() == username
				&& cUser.username != username) {
				chosenPM = user;
				return false;
			} else {
				return true;
			}
		});

		if (chosenPM) {
			if (chosenPM.pm) return ui.emit('selectchannel', chosenPM.pm);
			ui.emit('openpm', chosenPM, function() {
				ui.emit('selectchannel', chosenPM.pm);
			});
		} else {
			redirect();
		}
	}

	function selectRoom (cxt) {
		var	slug 		= cxt.params.room,
			chosenRoom	= false;
		
		ui.org.rooms.every(function(room) {
			if(room.slug == slug) {
				chosenRoom = room;
				return false;
			} else {
				return true;
			}
		});

		if (chosenRoom) {
			if (chosenRoom.joined) return ui.emit('selectchannel', chosenRoom);
			ui.emit('joinroom', chosenRoom, function() {
				ui.emit('selectchannel', chosenRoom);
			});
		} else {
			redirect();
		}
	}

	function redirect() {
		page.replace(baseURL + '/');
		setTimeout(function () {
			var msg = ui.messages.warning('url not found');
			setTimeout(function() {
				msg.remove();
			}, 6000);
		}, 500);
	}

}