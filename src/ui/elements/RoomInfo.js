import Emitter from 'emitter'

import '../../../react-components/room-info'
import * as convertCase from '../../api/convertCase'

export default class RoomInfo extends Emitter {
  constructor() {
    super()
    this.el = document.createElement('grape-room-info')
    this.el.props = {
      onInvite: ::this.onInviteMember,
      onKickMember: ::this.onKickMember,
      onLeave: ::this.onLeaveRoom,
      onClose: ::this.onHide
    }
    this.type = null
  }

  setProps(props) {
    this.el.props = {
      ...this.el.props,
      ...props
    }
  }

  updateChannel() {
    this.setProps({
      channel: formatChannel(this.channel),
      show: this.type === 'userProfileOrRoomInfo'
    })
  }

  onSelectChannel(channel) {
    if (channel.type !== 'room') {
      this.setProps({show: false})
      return
    }
    this.channel = channel
    this.updateChannel()
  }

  onSetUser(user) {
    this.user = user
    this.setProps({user: convertCase.toCamel(this.user.toJSON())})
  }

  onMemberJoinedChannel() {
    this.updateChannel()
  }

  onMemberLeftChannel() {
    this.updateChannel()
  }

  /**
   * Show or hide request from outside.
   */
  onShow({type}) {
    this.type = type
    if (type !== 'userProfileOrRoomInfo' || !this.channel) return
    this.setProps({show: true})
    this.emit('show')
  }

  /**
   * Hide request from outside.
   */
  onHide() {
    if (!this.el.props.show) return
    this.type = null
    this.setProps({show: false})
    this.emit('hide')
  }

  onLeaveRoom() {
    this.emit('leaveRoom', this.channel.id)
  }

  onInviteMember() {
    this.emit('toggleRoomInvite', this.channel)
  }

  onKickMember({id}) {
    this.emit('kickMember', {
      channelId: this.channel.id,
      userId: id
    })
  }
}

/**
 * Convert channel model to pure object and camelize.
 */
function formatChannel(channel) {
  const fChannel = convertCase.toCamel(channel.toJSON())
  if (fChannel.creator) {
    fChannel.creator = convertCase.toCamel(channel.creator.toJSON())
  }
  fChannel.users = channel.users.toArray().map(user => convertCase.toCamel(user.toJSON()))
  return fChannel
}
