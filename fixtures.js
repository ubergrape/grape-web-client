var UI = require('./src/ui');
var Room = require('./src/api/models/room');
var Org = require('./src/api/models/organization');
var User = require('./src/api/models/user');
var Chatline = require('./src/api/models/chatline');

module.exports = {
    org: new Org({
        id: 1
    }),
    user: new User({
        'id': 1,
        'username': 'alice'
    }),
    onlyInvitedUser: new User({
        'id': 2,
        'username': 'bob',
        'is_only_invited': true
    }),
    room : new Room({
        'id': 1,
        'slug': 'foo',
        'creator': 1        
    }),
    anotherRoom: new Room({
        'id': 2,
        'slug': 'boo',
        'creator': 1
    }),
    chatLine: new Chatline({
        'author': {
            'type': 'user',
            'id': 1
        },
        'channel': 1
    })
}