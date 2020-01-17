import React from 'react'
import Icon from 'grape-web/lib/svg-icons/Icon'
import injectSheet from 'grape-web/lib/jss'
import { FormattedMessage } from 'react-intl'
import { red } from 'grape-theme/dist/base-colors'
import fonts from 'grape-theme/dist/fonts'

const styles = {
  root: {
    display: 'flex',
    alignItems: 'center',
  },
  icon: {
    marginRight: 20,
    height: 40,
    width: 40,
    fill: red,
  },
  text: fonts.small,
  warning: {
    composes: '$text',
    color: red,
  },
}

const Message = ({ classes }) => (
  <div className={classes.root}>
    <Icon name="warningTriangle" className={classes.icon} />
    <div className={classes.message}>
      <p className={classes.text}>
        <FormattedMessage
          id="roomDeleteDialogConfirmMessage"
          defaultMessage="Are you sure you want to delete this room?"
          description="Room Delete Dialog: confirm (info) message"
        />
      </p>
      <p className={classes.warning}>
        <FormattedMessage
          id="roomDeleteDialogConfirmWarning"
          defaultMessage="Warning: This action can't be undone!"
          description="Room Delete Dialog: confirm (warning) message"
        />
      </p>
    </div>
  </div>
)

export default injectSheet(styles)(Message)
