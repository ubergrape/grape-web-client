let Room = require('../../src/api/models/room')
let Org = require('../../src/api/models/organization')
let User = require('../../src/api/models/user')
let Chatline = require('../../src/api/models/chatline')
require('../../src/ui')

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
    room: new Room({
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
