import React, {PureComponent} from 'react'
import {Provider, connect} from 'react-redux'

import {mapActionsToProps} from '../../app/redux'
import {fileUploadSelector} from '../../selectors'
import getStore from '../../app/store'
import {FileUpload} from '../../components/file-upload'

const actionNames = {
  uploadFiles: 'onUpload',
  rejectFiles: 'onReject',
  showUploadNotification: 'onNotify',
  hideUploadNotification: 'onHideNotification'
}

const ConnectedFileUpload = connect(
  fileUploadSelector,
  mapActionsToProps(actionNames)
)(FileUpload)

export default class FileUploadProvider extends PureComponent {
  render() {
    return (
      <Provider store={getStore()}>
        <ConnectedFileUpload>
          {this.props.children}
        </ConnectedFileUpload>
      </Provider>
    )
  }
}
