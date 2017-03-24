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
  broker(ui, 'selectchannel', ui.notifications, 'setRoom')
  broker(ui, 'newMsgNotification', ui.notifications, 'onNewMsgNotification')
  broker(ui, 'newInviteNotification', ui.notifications, 'onNewInviteNotification')
  broker(ui.reduxEmitter, 'showIntro', ui, 'showIntro')

  // notifications
  broker(ui.notifications, 'notificationClicked', ui.notifications, 'onNotificationClick')
  broker(ui.reduxEmitter, 'enableNotifications', ui, 'requestPermission')

  // room info
  broker.pass(ui.reduxEmitter, 'kickMember', ui, 'kickMember')
  broker.pass(ui.reduxEmitter, 'leaveRoom', ui, 'leaveRoom')

  // sidebar
  broker(ui.reduxEmitter, 'hideSidebar', ui, 'onHideSidebar')
  broker(ui.reduxEmitter, 'showSidebar', ui, 'onShowSidebar')
  broker(ui.reduxEmitter, 'error', ui, 'gotError')
  broker.pass(ui.reduxEmitter, 'hideSidebar', ui, 'hideSidebar')
}
