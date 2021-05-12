import React from 'react'
import { Provider, connect } from 'react-redux'

import { mapActionsToProps } from '../../app/redux'
import getStore from '../../app/store'
import { videoConferenceWarningComponentSelector as selector } from '../../selectors'
import { VideoConferenceWarningDialog } from '../../components/video-conference-warning-dialog'

const actionNames = {
  showVideoConferenceWarning: 'onShow',
  hideVideoConferenceWarning: 'onHide',
}

const ConnectedVideoConferenceWarningDialog = connect(
  selector,
  mapActionsToProps(actionNames),
)(VideoConferenceWarningDialog)

const VideoConferenceWarningDialogProvider = () => (
  <Provider store={getStore()}>
    <ConnectedVideoConferenceWarningDialog />
  </Provider>
)

export default VideoConferenceWarningDialogProvider
