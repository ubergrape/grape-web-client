import Room from '../../api/models/room'
import Org from '../../api/models/organization'
import User from '../../api/models/user'
import Chatline from '../../api/models/chatline'

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
