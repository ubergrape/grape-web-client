import React from 'react'
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

const FileUploadProvider = props => (
  <Provider store={getStore()}>
    <ConnectedFileUpload {...props} />
  </Provider>
)

export default FileUploadProvider
