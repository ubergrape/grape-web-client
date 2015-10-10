import User from './classes/User'
import Search from './classes/Search'
import Room from './classes/Room'
import Emoji from './classes/Emoji'

const types = {
  user: User,
  customEmoji: Emoji,
  emoji: Emoji,
  search: Search,
  room: Room
}

export function create(type, options) {
  let Obj = types[type] || Search
  return new Obj(options)
}
