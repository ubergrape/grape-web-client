import React from 'react'
import {FormattedMessage} from 'react-intl'

export default ({classes, onResend}) => (
  <div className={classes.row}>
    <div className={classes.avatarColumn} />
    <div className={classes.unsentWarning}>
      {' '}
      <FormattedMessage
        id="messageNotSendCheckConnection"
        defaultMessage="This message didn't send. Check your internet connection and"
      />
      {' '}
      <a href="" onClick={onResend}>
        <FormattedMessage
          id="clickToTryAgain"
          defaultMessage="click to try again"
        />
      </a>.
    </div>
  </div>
)
