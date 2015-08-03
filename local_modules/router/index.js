var page = require('page');

module.exports = Router;

function Router(ui) {	
	var baseURL = '/chat';
	var cUser = ui.user;
	var navRoomList = ui.navigation.roomList.items;
	var navPMList = ui.navigation.pmList.items;
	page.stop();
	page.base(baseURL);
	page('/', pickChannel);
	page('/@:pm', goToPM);
	page('/:room', goToRoom);
	page('/@:pm/:message', goToPM);
	page('/:room/:message', goToRoom);
	page('*', notFound);
	page();

	function pickChannel () {
		var redirectRoom = false;
		navRoomList.every(function(room) {
			if (room.joined) {
				redirectRoom = room;
				return false;
			}
			return true;
		});
		var redirectSlug = redirectRoom ? redirectRoom.slug : '@' + navPMList[0].username.toLowerCase();		
		page.replace(baseURL + '/' + redirectSlug);
	}

	function goToPM (cxt) {
		var username = cxt.params.pm;
		var user = findPM(username);
		var message = cxt.params.message ? cxt.params.message : null;
		if (user) {
			if (user.pm) return ui.emit('selectchannel', user.pm, message);
			ui.emit('openpm', user, function() {
				ui.emit('selectchannel', user.pm, message);
			});
		} else {
			notFound();
		}
	}

	function findPM (username) {
		var selectedUser = false;
		ui.org.users.every(function(user) {
			if(user.username.toLowerCase() == username
				&& cUser.username != username) {
				selectedUser = user;
				return false;
			} else {
				return true;
			}
		});
		return selectedUser;
	}

	function goToRoom (cxt) {
		var slug = cxt.params.room;
		var room = findRoom(slug);
		var message = cxt.params.message ? cxt.params.message : null;
		if (room) {
			if (room.joined) return ui.emit('selectchannel', room, message);
			ui.emit('joinroom', room, function() {
				ui.emit('selectchannel', room, message);
			});
		} else {
			notFound();
		}
	}

	function findRoom (slug) {
		var selectedRoom = false;
		ui.org.rooms.every(function(room) {
			if(room.slug == slug) {
				selectedRoom = room;
				return false;
			} else {
				return true;
			}
		});
		return selectedRoom;
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