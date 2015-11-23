import {bindActionCreators} from 'redux'

import {toCamel} from '../backend/convertCase'
import store from '../app/store'
import * as actions from './index'

const boundActions = bindActionCreators(actions, store.dispatch)

export default function subscribe(channel) {
  channel.on('data', data => {
    switch (data.event) {
      case 'channel.typing':
        boundActions.setTyping(data)
        break
      default:
    }
  })
}
