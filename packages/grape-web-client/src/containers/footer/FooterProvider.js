import React from 'react'
import { Provider, connect } from 'react-redux'

import { mapActionsToProps } from '../../app/redux'
import getStore from '../../app/store'
import { footerComponentSelector as selector } from '../../selectors'
import { Footer } from '../../components/footer'

const actionNames = {
  cleanupTyping: 'onCleanupTyping',
  showMarkdownTips: 'onShowMarkdownTips',
  uploadFiles: 'onUploadFiles',
  rejectFiles: 'onRejectFiles',
  showSearchBrowser: 'onShowSearchBrowser',
  showEmojiBrowser: 'onShowEmojiBrowser',
  showUsersAndRoomsBrowser: 'onShowUsersAndRoomsBrowser',
  showEmojiSuggestBrowser: 'onShowEmojiSuggestBrowser',
  hideBrowser: 'onHideBrowser',
  createMessage: 'onCreateMessage',
  editMessageSend: 'onEditMessageSend',
  editMessageAbort: 'onEditMessageAbort',
  editPreviousMessage: 'onEditPreviousMessage',
  requestAutocomplete: 'onRequestAutocomplete',
  requestAutocompleteServices: 'onRequestAutocompleteServices',
  requestAutocompleteServicesStats: 'onRequestAutocompleteServicesStats',
  setTyping: 'onSetTyping',
  goTo: 'goTo',
  goToAddIntegrations: 'onAddIntegration',
  searchChannelsToMention: 'onSearchChannelsToMention',
}

const ConnectedFooter = connect(
  selector,
  mapActionsToProps(actionNames),
)(Footer)

export default () => (
  <Provider store={getStore()}>
    <ConnectedFooter />
  </Provider>
)
