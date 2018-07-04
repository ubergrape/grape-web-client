import User from './classes/User'
import Search from './classes/Search'
import Room from './classes/Room'
import Emoji from './classes/Emoji'
import { getOptions, isGrapeUrl } from './utils'

const types = {
  user: User,
  customEmoji: Emoji,
  emoji: Emoji,
  search: Search,
  room: Room,
}

export function create(type, options) {
  const Obj = types[type] || Search
  return new Obj(options)
}

export { getOptions, isGrapeUrl }
