import PropTypes from 'prop-types'
import React from 'react'
import {FormattedMessage} from 'react-intl'

import Tooltip from '../tooltip/HoverTooltip'
import FabButton from './FabButton'

const tips = {
  room: (
    <FormattedMessage
      id="groupInfo"
      defaultMessage="Group Info"
    />
  ),
  pm: (
    <FormattedMessage
      id="userProfile"
      defaultMessage="User Profile"
    />
  )
}

const InfoButton = ({onClick, channel, isSelected}) => (
  <Tooltip message={tips[channel]}>
    <FabButton onClick={onClick} isSelected={isSelected} icon="sidebar" />
  </Tooltip>
)

InfoButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  isSelected: PropTypes.bool.isRequired,
  channel: PropTypes.oneOf(Object.keys(tips))
}


InfoButton.defaultProps = {
  channel: undefined
}

export default InfoButton
