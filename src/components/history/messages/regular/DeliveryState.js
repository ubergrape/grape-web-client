import React from 'react'
import capitalize from 'lodash/string/capitalize'
import moment from 'moment'
import {FormattedMessage} from 'react-intl'

import Tooltip from '../../../tooltip/HoverTooltip'

const deliveryStateTooltipMessages = {
  pending: (
    <FormattedMessage
      id="pending"
      description="message delivery status in tooltip"
      defaultMessage="Pending"
    />
  ),
  unsent: (
    <FormattedMessage
      id="unsent"
      description="message delivery status in tooltip"
      defaultMessage="Unsent"
    />
  ),
  send: (
    <FormattedMessage
      id="sent"
      description="message delivery status in tooltip"
      defaultMessage="Sent"
    />
  ),
  read: (
    <FormattedMessage
      id="read"
      description="message delivery status in tooltip"
      defaultMessage="Read"
    />
  )
}

export default ({time, state, classes}) => {
  // Mark only today's messages.
  const isFresh = moment(time).isSame(new Date(), 'day')

  if (!state || state === 'unsent' || !isFresh) return null

  return (
    <span
      className={[
        classes.stateIndicator,
        classes[`stateIndicator${capitalize(state)}`]
      ].join(' ')}
    >
      <Tooltip
        placement="left"
        message={deliveryStateTooltipMessages[state]}
      >
        <span className={classes.stateIndicatorTooltipTrigger} />
      </Tooltip>
    </span>
  )
}
