import Room from '../../src/api/models/room'
import Org from '../../src/api/models/organization'
import User from '../../src/api/models/user'
import Chatline from '../../src/api/models/chatline'
import '../../src/ui'

export default {
    org: new Org({
        id: 1
    }),
    user: new User({
        id: 1,
        username: 'alice'
    }),
    onlyInvitedUser: new User({
        id: 2,
        username: 'bob',
        is_only_invited: true
    }),
    room: new Room({
        id: 1,
        slug: 'foo',
        creator: 1
    }),
    anotherRoom: new Room({
        id: 2,
        slug: 'boo',
        creator: 1
    }),
    chatLine: new Chatline({
        author: {
            'type': 'user',
            'id': 1
        },
        channel: 1
    })
}
