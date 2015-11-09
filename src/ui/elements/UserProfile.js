import Emitter from 'emitter'

import '../../../react-components/user-profile'
import * as convertCase from '../../api/convertCase'

export default class UserProfile extends Emitter {
  constructor() {
    super()
    this.el = document.createElement('grape-user-profile')
    this.el.props = {
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

  onSelectChannel(channel) {
    if (channel.type !== 'pm') {
      this.setProps({show: false})
      return
    }
    this.user = channel.users[0]
    this.setProps({
      ...convertCase.toCamel(this.user.toJSON()),
      show: this.type === 'userProfileOrRoomInfo'
    })
  }

  /**
   * Show or hide request from outside.
   */
  onShow({type}) {
    this.type = type
    if (type !== 'userProfileOrRoomInfo' || !this.user) return
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
}
