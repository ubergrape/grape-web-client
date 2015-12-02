import broker from 'broker'

export default function pipeEvents(ui) {
  // ui
  broker(ui, 'selectchannel', ui, 'setRoomContext')
  broker(ui, 'selectchannel', ui.chatHeader, 'setRoom')
  broker(ui, 'channelupdate', ui.chatHeader, 'channelUpdate')
  broker(ui, 'roomrenameerror', ui.chatHeader, 'roomRenameError')
  broker(ui, 'setUser', ui.chatHeader, 'onSetUser')
  broker(ui, 'emptyOrg', ui.chatHeader, 'onEmptyOrg')
  broker(ui, 'hideSidebar', ui.chatHeader, 'onHideSidebar')
  broker(ui, 'orgReady', ui.chatHeader, 'onOrgReady')
  broker(ui, 'orgReady', ui.grapeInput, 'onOrgReady')
  broker(ui, 'setUser', ui.grapeInput, 'onSetUser')
  broker(ui, 'selectchannel', ui.grapeInput, 'onSelectChannel')
  broker(ui, 'emptyOrg', ui.grapeInput, 'onEmptyOrg')
  broker(ui, 'orgReady', ui.reduxEmitter, 'onOrgReady')
  broker(ui, 'setUser', ui.reduxEmitter, 'onSetUser')
  broker(ui, 'selectchannel', ui.reduxEmitter, 'onSelectChannel')
  broker(ui, 'setSettings', ui.reduxEmitter, 'onSetSettings')
  broker(ui, 'orgReady', ui.historyView, 'onOrgReady')
  broker(ui, 'selectchannel', ui.historyView, 'setRoom')
  broker(ui, 'gotHistory', ui.historyView, 'onGotHistory')
  broker(ui, 'nohistory', ui.historyView, 'noHistory')
  broker(ui, 'newMessage', ui.historyView, 'onNewMessage')
  broker(ui, 'focusMessage', ui.historyView, 'onFocusMessage')
  broker(ui, 'newPMOpened', ui.historyView, 'onNewPMOpened')
  broker(ui, 'newRoom', ui.historyView, 'onNewRoom')
  broker(ui, 'changeUser', ui.historyView, 'onChangeUser')
  broker(ui, 'emptyOrg', ui.historyView, 'onEmptyOrg')
  broker(ui, 'selectchannel', ui.title, 'setRoom')
  broker(ui, 'selectorganization', ui.title, 'setOrganization')
  broker(ui, 'selectchannel', ui.notifications, 'setRoom')
  broker(ui, 'newMsgNotification', ui.notifications, 'onNewMsgNotification')
  broker(ui, 'newInviteNotification', ui.notifications, 'onNewInviteNotification')
  broker(ui, 'selectorganization', ui.upload, 'setOrganization')
  broker(ui, 'uploadDragged', ui.upload, 'doUpload')
  broker(ui, 'orgReady', ui.organizationMenu, 'onOrgReady')
  broker(ui, 'settingsReady', ui.organizationMenu, 'onSettingsReady')
  broker(ui, 'viewChanged', ui.organizationMenu, 'onViewChanged')
  broker(ui, 'setUser', ui.organizationMenu, 'onSetUser')
  broker(ui, 'orgReady', ui.navigation, 'onOrgReady')
  broker(ui, 'newMessage', ui.navigation, 'onNewMessage')
  broker(ui, 'roomdeleted', ui.navigation, 'deleteRoom')
  broker(ui, 'selectchannel', ui.navigation, 'select')
  broker(ui, 'userMention', ui.navigation, 'onUserMention')
  broker(ui, 'changeUser', ui.navigation, 'onChangeUser')
  broker(ui, 'channelupdate', ui.navigation, 'onChannelUpdate')
  broker(ui, 'channelRead', ui.navigation, 'onChannelRead')
  broker(ui, 'joinedChannel', ui.navigation, 'onJoinedChannel')
  broker(ui, 'leftChannel', ui.navigation, 'onLeftChannel')
  broker(ui, 'deletedUser', ui.navigation, 'onDeletedUser')
  broker(ui, 'searchMessagesPayload', ui.messageSearch, 'onPayload')
  broker(ui, 'orgReady', ui.mentions, 'onOrgReady')
  broker(ui, 'setUser', ui.mentions, 'onSetUser')
  broker(ui, 'loadMentionsPayload', ui.mentions, 'onPayload')
  broker(ui, 'newMessage', ui.mentions, 'onMessage')
  broker(ui, 'memberLeftChannel', ui.reduxEmitter, 'onMemberLeftChannel')
  //broker(ui, 'newRoomMember', ui.roomInfo, 'onMemberJoinedChannel')
  //broker(ui, 'selectchannel', ui.roomInfo, 'onSelectChannel')
  //broker(ui, 'setUser', ui.roomInfo, 'onSetUser')
  //broker(ui, 'orgReady', ui.roomInfo, 'onOrgReady')
  broker(ui, 'searchFilesPayload', ui.sharedFiles, 'onPayload')
  broker(ui, 'selectchannel', ui.sharedFiles, 'onSelectChannel')
  broker(ui, 'newMessage', ui.sharedFiles, 'onMessage')

  // chat header
  broker.pass(ui.chatHeader, 'confirmroomrename', ui, 'confirmroomrename')
  broker.pass(ui.chatHeader, 'setDescription', ui, 'setDescription')
  broker(ui.chatHeader, 'toggledeleteroomdialog', ui, 'toggleDeleteRoomDialog')
  broker(ui.chatHeader, 'showSidebar', ui, 'onShowSidebar')
  broker(ui.chatHeader, 'hideSidebar', ui, 'onHideSidebar')
  //broker(ui.chatHeader, 'showSidebar', ui.messageSearch, 'onShow')
  //broker(ui.chatHeader, 'hideSidebar', ui.messageSearch, 'onHide')
  broker(ui.chatHeader, 'search', ui.messageSearch, 'onSearch')
  //broker(ui.chatHeader, 'showSidebar', ui.mentions, 'onShow')
  //broker(ui.chatHeader, 'hideSidebar', ui.mentions, 'onHide')
  broker(ui.chatHeader, 'showUserProfile', ui.reduxEmitter, 'onShowUserProfile')
  broker(ui.chatHeader, 'showChannelInfo', ui.reduxEmitter, 'onShowChannelInfo')
  //broker(ui.chatHeader, 'showSidebar', ui.roomInfo, 'onShow')
  //broker(ui.chatHeader, 'hideSidebar', ui.roomInfo, 'onHide')
  //broker(ui.chatHeader, 'showSidebar', ui.sharedFiles, 'onShow')
  //broker(ui.chatHeader, 'hideSidebar', ui.sharedFiles, 'onHide')


  // grape input
  broker.pass(ui.grapeInput, 'update', ui, 'update')
  broker.pass(ui.grapeInput, 'setTyping', ui, 'setTyping')
  broker.pass(ui.grapeInput, 'autocomplete', ui, 'autocomplete')
  broker.pass(ui.grapeInput, 'autocompletedate', ui, 'autocompletedate')
  broker(ui.grapeInput, 'editingdone', ui.historyView, 'unselectForEditing')
  broker(ui.grapeInput, 'input', ui.historyView, 'onInput')
  broker(ui.grapeInput, 'showmarkdowntips', ui, 'showMarkdownTips')
  broker(ui.grapeInput, 'resize', ui.historyView, 'onInputResize')

  // history view
  broker.pass(ui.historyView, 'hasread', ui, 'hasread')
  broker.pass(ui.historyView, 'needhistory', ui, 'needhistory')
  broker.pass(ui.historyView, 'deleteMessage', ui, 'deleteMessage')
  broker.pass(ui.historyView, 'requestMessage', ui, 'requestMessage')
  broker.pass(ui.historyView, 'send', ui, 'send')
  broker.pass(ui.historyView, 'loadHistoryForSearch', ui, 'loadHistoryForSearch')
  broker(ui.historyView, 'selectedforediting', ui.grapeInput, 'onEditMessage')
  broker(ui.historyView, 'switchToChatMode', ui, 'onSwitchToChatMode')
  broker(ui.historyView, 'switchToChatMode', ui.chatHeader, 'onSwitchToChatMode')
  broker(ui.historyView, 'switchToSearchMode', ui.chatHeader, 'onSwitchToSearchMode')
  broker(ui.historyView, 'toggleRoomInvite', ui, 'onToggleRoomInvite')
  broker(ui.historyView, 'toggleOrgInvite', ui, 'onToggleOrgInvite')
  broker(ui.historyView, 'triggerRoomManager', ui, 'onTriggerRoomManager')

  // notifications
  broker(ui.notifications, 'notificationClicked', ui, 'onNotificationClicked')

  // file upload
  broker(ui.upload, 'uploading', ui.historyView, 'onUploading')
  broker(ui.upload, 'uploading', ui, 'onUploading')
  broker(ui.upload, 'uploaded', ui, 'onUploaded')

  // clipboard
  broker(ui.clipboard, 'upload', ui.upload, 'doUpload')

  // organization popover
  broker.pass(ui.organizationMenu, 'editView', ui, 'editView')
  broker(ui.organizationMenu, 'toggleOrgInvite', ui, 'onToggleOrgInvite')

  // navigation
  broker(ui.navigation, 'triggerRoomManager', ui, 'onTriggerRoomManager')
  broker(ui.navigation, 'triggerPMManager', ui, 'onTriggerPMManager')

  // message search
  broker.pass(ui.messageSearch, 'search', ui, 'messageSearch')
  //broker(ui.messageSearch, 'show', ui, 'onShowSidebar')
  //broker(ui.messageSearch, 'hide', ui, 'onHideSidebar')
  //broker.pass(ui.messageSearch, 'hide', ui, 'hideSidebar')

  // mentions
  broker.pass(ui.mentions, 'load', ui, 'loadMentions')
  //broker(ui.mentions, 'show', ui, 'onShowSidebar')
  //broker(ui.mentions, 'hide', ui, 'onHideSidebar')
  //broker.pass(ui.mentions, 'hide', ui, 'hideSidebar')

  // room info
  broker.pass(ui.reduxEmitter, 'kickMember', ui, 'kickMember')
  broker.pass(ui.reduxEmitter, 'leaveRoom', ui, 'leaveRoom')
  broker(ui.reduxEmitter, 'toggleRoomInvite', ui, 'onToggleRoomInvite')
  //broker(ui.roomInfo, 'show', ui, 'onShowSidebar')
  //broker(ui.roomInfo, 'hide', ui, 'onHideSidebar')
  //broker.pass(ui.roomInfo, 'kickMember', ui, 'kickMember')
  //broker.pass(ui.roomInfo, 'leaveRoom', ui, 'leaveRoom')
  //broker.pass(ui.roomInfo, 'hide', ui, 'hideSidebar')
  //broker(ui.roomInfo, 'toggleRoomInvite', ui, 'onToggleRoomInvite')

  // shared files
  //broker(ui.sharedFiles, 'show', ui, 'onShowSidebar')
  //broker(ui.sharedFiles, 'hide', ui, 'onHideSidebar')
  //broker.pass(ui.sharedFiles, 'hide', ui, 'hideSidebar')
  //broker.pass(ui.sharedFiles, 'search', ui, 'searchFiles')

  // channel search
  broker(ui.reduxEmitter, 'triggerRoomManager', ui, 'onTriggerRoomManager')

  // sidebar
  broker(ui.reduxEmitter, 'hideSidebar', ui, 'onHideSidebar')
  broker(ui.reduxEmitter, 'showSidebar', ui, 'onShowSidebar')
  broker.pass(ui.reduxEmitter, 'hideSidebar', ui, 'hideSidebar')
}
