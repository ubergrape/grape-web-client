import Emitter from 'emitter'

import { bindActionCreators } from 'redux'
import * as actions from '../actions'

import store from '../app'

class EmitterToRedux extends Emitter {
  constructor() {
    super()
    this.actions = bindActionCreators(actions, store.dispatch)
  }

  onOrgReady(org) {
    this.actions.onOrgReady(org)
  }

  onSetUser(user) {
    this.actions.onUserSetted(user)
  }

  onRoomManager() {
    this.emit('triggerRoomManager')
  }
}

const emitterToRedux = new EmitterToRedux()
export default emitterToRedux
