import React from 'react'
import {FormattedMessage} from 'react-intl'

import Tooltip from '../../../../../tooltip/HoverTooltip'
import ActionButton from '../ActionButton'
import TaskIcon from './TaskIcon'

export default ({classes, isConnected, amount, onClick, onRefButton}) => (
  <Tooltip
    message={(
      <FormattedMessage
        id="tasks"
        defaultMessage="Tasks"
      />
    )}
  >
    <ActionButton
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
    </ActionButton>
  </Tooltip>
)
