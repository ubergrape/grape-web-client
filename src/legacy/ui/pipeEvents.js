import conf from '../../conf'
import broker from 'broker'

export default function pipeEvents(ui) {
  // ui
  broker(ui, 'selectchannel', ui.reduxEmitter, 'onSelectChannel')
  broker(ui, 'selectchannel', ui, 'setRoomContext')
  broker(ui, 'newPMOpened', ui.reduxEmitter, 'onNewPMOpened')

  // room info
  broker.pass(ui.reduxEmitter, 'kickMember', ui, 'kickMember')
  broker.pass(ui.reduxEmitter, 'leaveRoom', ui, 'leaveRoom')

  broker(ui.reduxEmitter, 'error', ui, 'gotError')
}
