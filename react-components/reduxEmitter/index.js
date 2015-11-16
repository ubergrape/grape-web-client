import Emitter from 'emitter'

import { bindActionCreators } from 'redux'
import * as actions from '../actions'

import store from '../app/store'

class ReduxEmitter extends Emitter {
  constructor() {
    super()
    this.actions = bindActionCreators(actions, store.dispatch)
  }

  onOrgReady(org) {
    this.actions.setOrg(org)
  }

  onSetUser(user) {
    this.actions.setUser(user)
  }

  showRoomManager() {
    this.emit('triggerRoomManager')
  }
}

const reduxEmitter = new ReduxEmitter()
export default reduxEmitter
