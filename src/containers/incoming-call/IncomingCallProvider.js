import React from 'react'
import { Provider, connect } from 'react-redux'
import injectSheet from 'grape-web/lib/jss'

import { mapActionsToProps } from '../../app/redux'
import getStore from '../../app/store'
import { incomingCallSelector as selector } from '../../selectors'
import { IncomingCall } from '../../components/incoming-call'

const actionNames = [
  'rejectIncomingCall',
  'replyWithMessage',
  'closeIncomingCall',
  'endSound',
]

const styles = {
  wrapper: {
    display: 'block',
    fontFamily: "nota-sans, 'Helvetica Neue', Arial, Helvetica, sans-serif",
  },
}

const ConnectedIncomingCall = connect(
  selector,
  mapActionsToProps(actionNames),
)(IncomingCall)

const Wrapper = ({ classes }) => (
  <div className={classes.wrapper}>
    <Provider store={getStore()}>
      <ConnectedIncomingCall />
    </Provider>
  </div>
)

export default injectSheet(styles)(Wrapper)
