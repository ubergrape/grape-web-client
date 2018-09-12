import React, { PureComponent } from 'react'
import { Provider, connect } from 'react-redux'

import { mapActionsToProps } from '../../app/redux'
import { fileUploadComponentSelector } from '../../selectors'
import getStore from '../../app/store'
import { FileUpload } from '../../components/file-upload'

const actionNames = {
  uploadFiles: 'onUpload',
  rejectFiles: 'onReject',
  showUploadNotification: 'onNotify',
  hideUploadNotification: 'onHideNotification',
}

const ConnectedFileUpload = connect(
  fileUploadComponentSelector,
  mapActionsToProps(actionNames),
)(FileUpload)

export default class FileUploadProvider extends PureComponent {
  render() {
    return (
      <Provider store={getStore()}>
        <ConnectedFileUpload className={this.props.className}>
          {this.props.children}
        </ConnectedFileUpload>
      </Provider>
    )
  }
}
