import React from 'react'
import { Provider, connect } from 'react-redux'
import injectSheet from 'grape-web/lib/jss'

import { mapActionsToProps } from '../../app/redux'
import getStore from '../../app/store'
import { callStatusComponentSelector as selector } from '../../selectors'
import { CallStatus } from '../../components/new/call-status'

const actionNames = ['updateCallStatusTimer', 'closeCallStatus']

const styles = {
  wrapper: {
    display: 'block',
    fontFamily: "nota-sans, 'Helvetica Neue', Arial, Helvetica, sans-serif",
  },
}

const ConnectedCallStatus = connect(
  selector,
  mapActionsToProps(actionNames),
)(CallStatus)

const CallStatusProvider = ({ classes }) => (
  <div className={classes.wrapper}>
    <Provider store={getStore()}>
      <ConnectedCallStatus />
    </Provider>
  </div>
)

export default injectSheet(styles)(CallStatusProvider)
