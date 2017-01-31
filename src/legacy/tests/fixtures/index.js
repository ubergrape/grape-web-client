import Room from '../../api/models/room'
import Org from '../../api/models/organization'
import User from '../../api/models/user'
import Chatline from '../../api/models/chatline'
import conf from '../../../conf'

conf.setup({
  server: {
    staticPath: 'http://example'
  }
})

export const org = new Org({
  id: 1
})

export const user = new User({
  id: 1,
  username: 'alice'
})

export const onlyInvitedUser = new User({
  id: 2,
  username: 'bob',
  is_only_invited: true
})

export const room = new Room({
  id: 1,
  slug: 'foo',
  creator: 1
})

export const anotherRoom = new Room({
  id: 2,
  slug: 'boo',
  creator: 1
})

export const chatLine = new Chatline({
  author: {
    type: 'user',
    id: 1
  },
  channel: 1
})
