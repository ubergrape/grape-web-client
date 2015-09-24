var context = require.context('./src', true, /tests/);
window.CHATGRAPE_CONFIG = {
    'staticPath': 'http://example/',
    constants: {
      roles: {
        ROLE_USER: 0,
        ROLE_ADMIN: 1,
        ROLE_OWNER: 2
      }
    }
};
require('./src/templates');
var UI = require('./src/ui');
var Room = require('./src/api/models/room');
var Org = require('./src/api/models/organization');
var User = require('./src/api/models/user');
var Chatline = require('./src/api/models/chatline');

// dummies
window.user = new User({
    'id': 1,
    'username': 'alice'
});
window.onlyInvitedUser = new User({
    'id': 2,
    'username': 'bob',
    'is_only_invited': true
});
window.room = new Room({
    'id': 1,
    'slug': 'foo',
    'creator': 1
});
window.org = new Org({
    'id': 1
});
window.chatline = new Chatline({
    'author': {
        'type': 'user',
        'id': 1
    },
    'channel': 1
});

context.keys().forEach(context);
