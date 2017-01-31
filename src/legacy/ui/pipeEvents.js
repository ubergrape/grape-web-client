import conf from '../../conf'
import broker from 'broker'

export default function pipeEvents(ui) {
  // ui
  broker(ui, 'orgReady', ui.reduxEmitter, 'onOrgReady')
  broker(ui, 'setUser', ui.reduxEmitter, 'onSetUser')
  broker(ui, 'selectchannel', ui.reduxEmitter, 'onSelectChannel')
  broker(ui, 'setSettings', ui.reduxEmitter, 'onSetSettings')
  broker(ui, 'selectchannel', ui, 'setRoomContext')
  broker(ui, 'orgReady', ui.grapeInput, 'onOrgReady')
  broker(ui, 'setUser', ui.grapeInput, 'onSetUser')
  broker(ui, 'selectchannel', ui.grapeInput, 'onSelectChannel')
  broker(ui, 'emptyOrg', ui.grapeInput, 'onEmptyOrg')
  broker(ui, 'newPMOpened', ui.reduxEmitter, 'onNewPMOpened')
  broker(ui, 'selectchannel', ui.notifications, 'setRoom')
  broker(ui, 'newMsgNotification', ui.notifications, 'onNewMsgNotification')
  broker(ui, 'newInviteNotification', ui.notifications, 'onNewInviteNotification')
  broker(ui, 'orgReady', ui.organizationMenu, 'onOrgReady')
  broker(ui, 'settingsReady', ui.organizationMenu, 'onSettingsReady')
  broker(ui, 'viewChanged', ui.organizationMenu, 'onViewChanged')
  broker(ui, 'setUser', ui.organizationMenu, 'onSetUser')
  broker(ui.reduxEmitter, 'toggleOrgSettings', ui.organizationMenu, 'toggle')
  broker(ui.reduxEmitter, 'toggledeleteroomdialog', ui, 'toggleDeleteRoomDialog')
  broker(ui.reduxEmitter, 'showIntro', ui, 'showIntro')

  // grape input
  broker.pass(ui.grapeInput, 'update', ui, 'update')
  broker.pass(ui.grapeInput, 'setTyping', ui, 'setTyping')
  broker.pass(ui.grapeInput, 'autocomplete', ui, 'autocomplete')
  broker.pass(ui.grapeInput, 'autocompletedate', ui, 'autocompletedate')
  broker(ui.grapeInput, 'editPreviousMessage', ui.reduxEmitter, 'onEditPreviousMessage')
  broker(ui.grapeInput, 'input', ui.reduxEmitter, 'createMessage')
  broker(ui.grapeInput, 'endEditMessage', ui.reduxEmitter, 'endEditMessage')
  broker(ui.reduxEmitter, 'editMessage', ui.grapeInput, 'onEditMessage')
  broker(ui.reduxEmitter, 'showEmojiBrowser', ui.grapeInput, 'onShowEmojiBrowser')
  broker(ui.reduxEmitter, 'showGrapeBrowser', ui.grapeInput, 'onShowGrapeSearch')

  // notifications
  broker(ui.notifications, 'notificationClicked', ui.notifications, 'onNotificationClick')
  broker(ui.reduxEmitter, 'enableNotifications', ui, 'requestPermission')

  // organization popover
  broker.pass(ui.organizationMenu, 'editView', ui, 'editView')
  broker(ui.organizationMenu, 'toggleOrgInvite', ui.reduxEmitter, 'showInviteToOrg')

  // room info
  broker.pass(ui.reduxEmitter, 'kickMember', ui, 'kickMember')
  broker.pass(ui.reduxEmitter, 'leaveRoom', ui, 'leaveRoom')

  // sidebar
  broker(ui.reduxEmitter, 'hideSidebar', ui, 'onHideSidebar')
  broker(ui.reduxEmitter, 'showSidebar', ui, 'onShowSidebar')
  broker(ui.reduxEmitter, 'error', ui, 'gotError')
  broker.pass(ui.reduxEmitter, 'hideSidebar', ui, 'hideSidebar')
}
