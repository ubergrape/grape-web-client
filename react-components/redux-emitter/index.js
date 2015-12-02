import Emitter from 'emitter'

import {toCamel} from '../backend/convertCase'

import {bindActionCreators} from 'redux'
import * as actions from '../actions'

import store from '../app/store'

class ReduxEmitter extends Emitter {
  constructor() {
    super()
    this.actions = bindActionCreators(actions, store.dispatch)
  }

  onOrgReady(org) {
    let jsonOrg = org.toJSON()
    jsonOrg.users = jsonOrg.users.map(user => toCamel(user.toJSON()))
    jsonOrg = toCamel(jsonOrg)
    this.actions.setOrg(jsonOrg)
    this.actions.setUsers(jsonOrg.users)
    this.actions.setChannels(jsonOrg.channels)
  }

  onSetUser(user) {
    this.actions.setUser(toCamel(user.toJSON()))
  }

  onSelectChannel(channel) {
    this.actions.setChannel(toCamel(channel.toJSON()))
  }

  onSetSettings(settings) {
    this.actions.setSettings(toCamel(settings))
  }

  showRoomManager() {
    this.emit('triggerRoomManager')
  }
}

const reduxEmitter = new ReduxEmitter()
export default reduxEmitter
