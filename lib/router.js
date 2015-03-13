var Router = require('router');

module.exports = URLManager;

function URLManager() {

	this.URLManager = {};
	this.URLManager.router = new Router();
	this.URLManager.router.on('/chat/:channel', showRooms);
	this.URLManager.router.start();

	var rooms = this.org.rooms;

	function showRooms() {
		console.log(rooms);
	}
}