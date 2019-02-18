import PropTypes from 'prop-types'
import React from 'react'

import {
  GroupInfo as GroupInfoText,
  UserProfile as UserProfileText,
} from '../i18n'
import Tooltip from '../tooltip/HoverTooltip'
import FabButton from './FabButton'

const tips = {
  room: <GroupInfoText />,
  pm: <UserProfileText />,
}

const InfoButton = ({ onClick, channel, isSelected, colors }) => (
  <Tooltip message={tips[channel]}>
    <FabButton
      onClick={onClick}
      isSelected={isSelected}
      colors={colors}
      icon="sidebar"
    />
  </Tooltip>
)

InfoButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  isSelected: PropTypes.bool.isRequired,
  colors: PropTypes.object.isRequired,
  channel: PropTypes.oneOf(Object.keys(tips)),
}

InfoButton.defaultProps = {
  channel: undefined,
}

export default InfoButton
