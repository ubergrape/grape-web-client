import React from 'react'
import { Provider, connect } from 'react-redux'

import { mapActionsToProps } from '../../app/redux'
import getStore from '../../app/store'
import { historyComponentSelector as selector } from '../../selectors'
import History from '../../components/history/History'

const actionNames = {
  loadHistory: 'onLoad',
  loadMoreHistory: 'onLoadMore',
  loadLatestHistory: 'onJump',
  renderOlderHistory: 'onTouchTopEdge',
  unsetHistoryScrollTo: 'onUserScrollAfterScrollTo',
  removeMessages: 'onRemove',
  editMessage: 'onEdit',
  resendMessage: 'onResend',
  readMessage: 'onRead',
  openPm: 'onOpenPm',
  showChannelMembersInvite: 'onInvite',
  goToAddIntegrations: 'onAddIntegration',
  showToastNotification: 'onCopyLink',
  quoteMessage: 'onQuote',
  showRemoveLinkAttachments: 'onRemoveLinkAttachment',
  pinMessage: 'onPin',
  unpinMessage: 'onUnpin',
  showNewConversation: 'onNewConversation',
}

const ConnectedHistory = connect(
  selector,
  mapActionsToProps(actionNames),
)(History)

const HistoryProvider = () => (
  <Provider store={getStore()}>
    <ConnectedHistory />
  </Provider>
)

export default HistoryProvider
