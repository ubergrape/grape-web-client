import conf from '../../conf'
import broker from 'broker'

export default function pipeEvents(ui) {
  // ui
  broker(ui, 'orgReady', ui.reduxEmitter, 'onOrgReady')
  broker(ui, 'setUser', ui.reduxEmitter, 'onSetUser')
  broker(ui, 'selectchannel', ui.reduxEmitter, 'onSelectChannel')
  broker(ui, 'setSettings', ui.reduxEmitter, 'onSetSettings')
  broker(ui, 'selectchannel', ui, 'setRoomContext')
  broker(ui, 'newPMOpened', ui.reduxEmitter, 'onNewPMOpened')

  // room info
  broker.pass(ui.reduxEmitter, 'kickMember', ui, 'kickMember')
  broker.pass(ui.reduxEmitter, 'leaveRoom', ui, 'leaveRoom')

  broker(ui.reduxEmitter, 'error', ui, 'gotError')
  broker(ui.reduxEmitter, 'initRouter', ui, 'initRouter')
}
