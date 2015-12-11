import {toCamel} from '../backend/convertCase'
import * as selectors from '../selectors'
import store from '../app/store'
import boundActions from './boundActions'

export default function subscribe(channel) {
  channel.on('data', data => {
    const cData = toCamel(data)
    switch (cData.event) {
      case 'channel.typing':
        boundActions.setTyping(selectors.setTypingSelector(store.getState()), cData)
        break
      case 'message.new':
        boundActions.handleNewMessage(cData)
        break
      case 'message.removed':
        boundActions.handleRemovedMessage(cData)
        break
      default:
    }
  })
}
