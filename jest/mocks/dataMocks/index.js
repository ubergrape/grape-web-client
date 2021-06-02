import { getUsers } from './getUsers'
import { getRooms } from './getRooms'
import { create } from './create'
import { getChannel } from './get'

export { getUser, getUsers } from './getUsers'
export { getRoom, getRooms } from './getRooms'

export default {
  getUsers,
  getRooms,
  get: getChannel,
  create,
}
