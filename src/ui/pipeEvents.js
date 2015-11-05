import broker from 'broker'

export default function pipeEvents(ui) {
  // ui
  broker(ui, 'selectchannel', ui, 'setRoomContext')
  broker(ui, 'selectchannel', ui.chatHeader, 'setRoom')
  broker(ui, 'channelupdate', ui.chatHeader, 'channelUpdate')
  broker(ui, 'roomrenameerror', ui.chatHeader, 'roomRenameError')
  broker(ui, 'setUser', ui.chatHeader, 'onSetUser')
  broker(ui, 'emptyOrg', ui.chatHeader, 'onEmptyOrg')
  broker(ui, 'orgReady', ui.grapeInput, 'onOrgReady')
  broker(ui, 'setUser', ui.grapeInput, 'onSetUser')
  broker(ui, 'selectchannel', ui.grapeInput, 'onSelectChannel')
  broker(ui, 'emptyOrg', ui.grapeInput, 'onEmptyOrg')
  broker(ui, 'orgReady', ui.channelSearch, 'onOrgReady')
  broker(ui, 'setUser', ui.channelSearch, 'onSetUser')
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
  broker(ui, 'orgReady', ui.rightSidebar, 'onOrgReady')
  broker(ui, 'selectchannel', ui.rightSidebar, 'onSelectChannel')
  broker(ui, 'setUser', ui.rightSidebar, 'onSetUser')
  broker(ui, 'searchPayload', ui.rightSidebar, 'onSearchPayload')
  broker(ui, 'searchFilesPayload', ui.rightSidebar, 'onSearchFilesPayload')
  broker(ui, 'searchFilesError', ui.rightSidebar, 'onSearchFilesError')
  broker(ui, 'loadMentionsPayload', ui.rightSidebar, 'onLoadMentionsPayload')
  broker(ui, 'loadMentionsError', ui.rightSidebar, 'onLoadMentionsError')
  broker(ui, 'newMessage', ui.rightSidebar, 'onNewMessage')
  broker(ui, 'memberLeftChannel', ui.rightSidebar, 'onMemberLeftChannel')
  broker(ui, 'newRoomMember', ui.rightSidebar, 'onMemberJoinedChannel')

  // chat header
  broker.pass(ui.chatHeader, 'confirmroomrename', ui, 'confirmroomrename')
  broker.pass(ui.chatHeader, 'setDescription', ui, 'setDescription')
  broker(ui.chatHeader, 'toggleRightSidebar', ui.rightSidebar, 'onToggle')
  broker(ui.chatHeader, 'showSidebar', ui.rightSidebar, 'onShow')
  broker(ui.chatHeader, 'toggledeleteroomdialog', ui, 'toggleDeleteRoomDialog')
  broker(ui.chatHeader, 'search', ui.rightSidebar, 'onSearch')

  // grape input
  broker.pass(ui.grapeInput, 'update', ui, 'update')
  broker.pass(ui.grapeInput, 'starttyping', ui, 'starttyping')
  broker.pass(ui.grapeInput, 'stoptyping', ui, 'stoptyping')
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
  broker.pass(ui.historyView, 'stoptyping', ui, 'stoptyping')
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

  // right sidebar
  broker.pass(ui.rightSidebar, 'kickMember', ui, 'kickMember')
  broker.pass(ui.rightSidebar, 'leaveRoom', ui, 'leaveRoom')
  broker(ui.rightSidebar, 'show', ui, 'onShowRightSidebar')
  broker(ui.rightSidebar, 'hide', ui, 'onHideRightSidebar')
  broker(ui.rightSidebar, 'toggleRoomInvite', ui, 'onToggleRoomInvite')
  broker.pass(ui.rightSidebar, 'searchFiles', ui, 'searchFiles')
  broker.pass(ui.rightSidebar, 'loadMentions', ui, 'loadMentions')
  broker.pass(ui.rightSidebar, 'search', ui, 'search')

  // channel search
  broker(ui.channelSearch, 'triggerRoomManager', ui, 'onTriggerRoomManager')
}
