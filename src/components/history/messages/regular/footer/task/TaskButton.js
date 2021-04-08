import React from 'react'
import { FormattedMessage } from 'react-intl'
import IconButton from 'grape-web/lib/components/icon-button'

import Tooltip from '../../../../../tooltip/HoverTooltip'
import TaskIcon from './TaskIcon'

export default ({ classes, isConnected, amount, onClick, onRefButton }) => (
  <Tooltip
    message={
      <FormattedMessage
        id="tasksTooltip"
        defaultMessage="Tasks"
        description="Message NLP task button tooltip."
      />
    }
  >
    <IconButton
      className={classes.taskButton}
      onClick={onClick}
      buttonRef={onRefButton}
    >
      <TaskIcon
        classes={classes}
        isConnected={isConnected}
        className={classes.taskButtonIcon}
      />
      <span className={classes.taskButtonText}>{amount}</span>
    </IconButton>
  </Tooltip>
)
