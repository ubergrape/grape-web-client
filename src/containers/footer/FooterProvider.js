import React, {PureComponent} from 'react'
import {Provider, connect} from 'react-redux'

import {mapActionsToProps} from '../../app/redux'
import getStore from '../../app/store'
import {footerComponentSelector as selector} from '../../selectors'
import {Footer} from '../../components/footer'

const actionNames = {
  cleanupTyping: 'cleanupTyping',
  showMarkdownTips: 'onShowMarkdownTips',
  uploadFiles: 'onUpload',
  rejectFiles: 'onRejectFiles',
  showGrapeBrowser: 'onShowGrapeBrowser',
  showEmojiBrowser: 'onShowEmojiBrowser'
}

const ConnectedFooter = connect(
  selector,
  mapActionsToProps(actionNames)
)(Footer)

export default class FooterProvider extends PureComponent {
  render() {
    return (
      <Provider store={getStore()}>
        <ConnectedFooter />
      </Provider>
    )
  }
}
