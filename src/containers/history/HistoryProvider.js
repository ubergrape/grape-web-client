import React, {PureComponent} from 'react'
import {Provider, connect} from 'react-redux'

import {mapActionsToProps} from '../../app/redux'
import getStore from '../../app/store'
import {historyComponentSelector as selector} from '../../selectors'
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
  goToPmChannel: 'onGoToPmChannel',
  showChannelMembersInvite: 'onInvite',
  goToAddIntegrations: 'onAddIntegration',
  showToastNotification: 'onCopyLink',
  quoteMessage: 'onQuote',
  showRemoveLinkAttachments: 'onRemoveLinkAttachment',
  pinMessage: 'onPin',
  unpinMessage: 'onUnpin'
}

const ConnectedHistory = connect(
  selector,
  mapActionsToProps(actionNames)
)(History)

export default class HistoryProvider extends PureComponent {
  render() {
    return (
      <Provider store={getStore()}>
        <ConnectedHistory />
      </Provider>
    )
  }
}
