var Router = require('router');

module.exports = doRouter;

function doRouter() {
	var router = new Router()
		.on('/chat/:channel', function() {
			
		})
		.start();
}

