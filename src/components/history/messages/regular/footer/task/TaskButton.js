import React from 'react'
import {FormattedMessage} from 'react-intl'
import Icon from 'grape-web/lib/svg-icons/Icon'

import Tooltip from '../../../../../tooltip/HoverTooltip'
import ActionButton from '../ActionButton'

export default ({classes, isConnected, amount, onClick, onRefButton}) => {
  const content = []

  if (isConnected) {
    content.push(
      <Icon name="lightningBolt" className={classes.taskButtonIconConnected} key="0" />,
      <Icon name="checkCircle" className={classes.taskButtonIconConnectedCheckmark} key="0.0" />
    )
  } else {
    content.push(<Icon name="lightningBolt" className={classes.taskButtonIcon} key="0" />)
  }

  content.push(<span className={classes.taskButtonText} key="1">{amount}</span>)

  return (
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
        {content}
      </ActionButton>
    </Tooltip>
  )
}
