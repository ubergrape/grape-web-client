import conf from 'conf'
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
  if (!conf.newHistory) {
    broker(ui, 'orgReady', ui.historyView, 'onOrgReady')
    broker(ui, 'selectchannel', ui.historyView, 'setRoom')
    broker(ui, 'gotHistory', ui.historyView, 'onGotHistory')
    broker(ui, 'nohistory', ui.historyView, 'noHistory')
    broker(ui, 'newMessage', ui.historyView, 'onNewMessage')
    broker(ui, 'focusMessage', ui.historyView, 'onFocusMessage')
    broker(ui, 'newPMOpened', ui.historyView, 'onNewPMOpened')
    broker(ui, 'newPMOpened', ui.reduxEmitter, 'onNewPMOpened')
    broker(ui, 'newRoom', ui.historyView, 'onNewRoom')
    broker(ui, 'changeUser', ui.historyView, 'onChangeUser')
    broker(ui, 'emptyOrg', ui.historyView, 'onEmptyOrg')
  }
  broker(ui, 'selectchannel', ui.notifications, 'setRoom')
  broker(ui, 'newMsgNotification', ui.notifications, 'onNewMsgNotification')
  broker(ui, 'newInviteNotification', ui.notifications, 'onNewInviteNotification')
  broker(ui, 'selectorganization', ui.upload, 'setOrganization')
  broker(ui, 'uploadDragged', ui.upload, 'doUpload')
  broker(ui, 'orgReady', ui.organizationMenu, 'onOrgReady')
  broker(ui, 'settingsReady', ui.organizationMenu, 'onSettingsReady')
  broker(ui, 'viewChanged', ui.organizationMenu, 'onViewChanged')
  broker(ui, 'setUser', ui.organizationMenu, 'onSetUser')
  broker(ui.reduxEmitter, 'toggleOrgSettings', ui.organizationMenu, 'toggle')
  broker(ui.reduxEmitter, 'toggledeleteroomdialog', ui, 'toggleDeleteRoomDialog')

  // grape input
  broker.pass(ui.grapeInput, 'update', ui, 'update')
  broker.pass(ui.grapeInput, 'setTyping', ui, 'setTyping')
  broker.pass(ui.grapeInput, 'autocomplete', ui, 'autocomplete')
  broker.pass(ui.grapeInput, 'autocompletedate', ui, 'autocompletedate')
  broker(ui.grapeInput, 'editPreviousMessage', ui.reduxEmitter, 'onEditPreviousMessage')
  if (conf.newHistory) {
    broker(ui.reduxEmitter, 'editMessage', ui.grapeInput, 'onEditMessage')
    broker(ui.grapeInput, 'input', ui.reduxEmitter, 'createMessage')
  } else {
    broker(ui.grapeInput, 'editingdone', ui.historyView, 'unselectForEditing')
    broker(ui.grapeInput, 'input', ui.historyView, 'onInput')
    broker(ui.grapeInput, 'showmarkdowntips', ui, 'showMarkdownTips')
    broker(ui.grapeInput, 'resize', ui.historyView, 'onInputResize')
    broker(ui.reduxEmitter, 'focusGrapeInput', ui.grapeInput, 'focusGrapeInput')
  }

  // history view
  if (!conf.newHistory) {
    broker.pass(ui.historyView, 'hasread', ui, 'hasread')
    broker.pass(ui.historyView, 'needhistory', ui, 'needhistory')
    broker.pass(ui.historyView, 'deleteMessage', ui, 'deleteMessage')
    broker.pass(ui.historyView, 'requestMessage', ui, 'requestMessage')
    broker.pass(ui.historyView, 'send', ui, 'send')
    broker.pass(ui.historyView, 'loadHistoryForSearch', ui, 'loadHistoryForSearch')
    broker(ui.historyView, 'selectedforediting', ui.grapeInput, 'onEditMessage')
    broker(ui.historyView, 'switchToChatMode', ui, 'onSwitchToChatMode')
    broker(ui.historyView, 'showRoomInvite', ui.reduxEmitter, 'showRoomInvite')
    broker(ui.historyView, 'toggleOrgInvite', ui, 'onToggleOrgInvite')
    broker(ui.historyView, 'triggerRoomManager', ui, 'onTriggerRoomManager')
  }

  // notifications
  broker(ui.notifications, 'notificationClicked', ui.notifications, 'onNotificationClick')
  broker(ui.reduxEmitter, 'enableNotifications', ui, 'requestPermission')

  // file upload
  if (!conf.newHistory) {
    broker(ui.upload, 'uploading', ui.historyView, 'onUploading')
  }
  broker(ui.upload, 'uploading', ui, 'onUploading')
  broker(ui.upload, 'uploaded', ui, 'onUploaded')

  // clipboard
  broker(ui.clipboard, 'upload', ui.upload, 'doUpload')

  // organization popover
  broker.pass(ui.organizationMenu, 'editView', ui, 'editView')
  broker(ui.organizationMenu, 'toggleOrgInvite', ui, 'onToggleOrgInvite')
  broker(ui.reduxEmitter, 'toggleOrgInvite', ui, 'onToggleOrgInvite')

  // channel search, naviation
  broker(ui.reduxEmitter, 'triggerPMManager', ui, 'onTriggerPMManager')
  broker(ui.reduxEmitter, 'triggerRoomManager', ui, 'onTriggerRoomManager')

  // room info
  broker.pass(ui.reduxEmitter, 'kickMember', ui, 'kickMember')
  broker.pass(ui.reduxEmitter, 'leaveRoom', ui, 'leaveRoom')

  // sidebar
  broker(ui.reduxEmitter, 'hideSidebar', ui, 'onHideSidebar')
  broker(ui.reduxEmitter, 'showSidebar', ui, 'onShowSidebar')
  broker(ui.reduxEmitter, 'error', ui, 'gotError')
  broker.pass(ui.reduxEmitter, 'hideSidebar', ui, 'hideSidebar')
}
