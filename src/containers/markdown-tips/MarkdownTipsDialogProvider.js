import React from 'react'
import { Provider, connect } from 'react-redux'

import { mapActionsToProps } from '../../app/redux'
import getStore from '../../app/store'
import { markdownTipsSelector as selector } from '../../selectors'
import { MarkdownTipsDialog } from '../../components/old/markdown-tips'

const actionNames = {
  hideMarkdownTips: 'onHide',
}

const ConnectedMarkdownTipsDialog = connect(
  selector,
  mapActionsToProps(actionNames),
)(MarkdownTipsDialog)

export default () => (
  <Provider store={getStore()}>
    <ConnectedMarkdownTipsDialog />
  </Provider>
)
