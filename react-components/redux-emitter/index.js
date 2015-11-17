import Emitter from 'emitter'

import {toCamel} from '../../src/api/convertCase'

import {bindActionCreators} from 'redux'
import * as actions from '../actions'

import store from '../app/store'

class ReduxEmitter extends Emitter {
  constructor() {
    super()
    this.actions = bindActionCreators(actions, store.dispatch)
  }

  onOrgReady(org) {
    this.actions.setOrg(toCamel(org.toJSON()))
  }

  onSetUser(user) {
    this.actions.setUser(toCamel(user.toJSON()))
  }

  showRoomManager() {
    this.emit('triggerRoomManager')
  }
}

const reduxEmitter = new ReduxEmitter()
export default reduxEmitter
