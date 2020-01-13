import React from 'react'
import { FormattedMessage } from 'react-intl'

export default ({ classes, onResend }) => (
  <div className={classes.row}>
    <div className={classes.avatarColumn} />
    <div className={classes.unsentWarning}>
      <span className={classes.unsentText}>
        <FormattedMessage
          id="messageNotSendCheckConnection"
          defaultMessage="This message didn't send. Check your internet connection and"
        />
      </span>
      <button className={classes.unsentButton} onClick={onResend}>
        <FormattedMessage
          id="clickToTryAgain"
          defaultMessage="click to try again"
        />
      </button>
    </div>
  </div>
)
