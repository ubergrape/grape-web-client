import { getUsers } from './users/getUsers'
import { getRooms } from './rooms/getRooms'
import { create } from './rooms/create'
import { getChannel } from './channels/get'

export { getUser, getUsers } from './users/getUsers'
export { getRoom, getRooms } from './rooms/getRooms'

export default {
  usersGetUsers: getUsers,
  roomsGetRooms: getRooms,
  roomsCreate: create,
  channelsGet: getChannel,
}
