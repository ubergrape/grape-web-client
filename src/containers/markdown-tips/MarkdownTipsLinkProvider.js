import React, {PureComponent} from 'react'
import {Provider, connect} from 'react-redux'

import {mapActionsToProps} from '../../app/redux'
import getStore from '../../app/store'
import {markdownTipsSelector as selector} from '../../selectors'
import {Link} from '../../components/markdown-tips'

const actionNames = {
  showMarkdownTips: 'onClick'
}

const ConnectedLink = connect(
  selector,
  mapActionsToProps(actionNames)
)(Link)

export default class MarkdownTipsLinkProvider extends PureComponent {
  render() {
    return (
      <Provider store={getStore()}>
        <ConnectedLink />
      </Provider>
    )
  }
}
