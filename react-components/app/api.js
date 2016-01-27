import rpc from '../backend/rpc'

export function createRoom(room, onSuccess, onError) {
  room.organization = this.organization.id
  rpc({
    ns: 'rooms',
    action: 'create',
    args: [room]
  }, function (err, room) {
    if (err) return this.emit('roomCreationError', err)
    this.emit('roomCreated', this._tryAddRoom(room))
  }.bind(this))

}
