import PropTypes from 'prop-types'
import React from 'react'
import { FormattedMessage } from 'react-intl'

import Tooltip from '../tooltip/HoverTooltip'
import FabButton from './FabButton'

const tip = (
  <FormattedMessage
    id="importantMessages"
    defaultMessage="Important Messages"
  />
)

const LabeledMessagesButton = ({ onClick, isSelected, colors }) => (
  <Tooltip message={tip} align="right">
    <FabButton
      onClick={onClick}
      colors={colors}
      isSelected={isSelected}
      icon="tag"
    />
  </Tooltip>
)

LabeledMessagesButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  isSelected: PropTypes.bool.isRequired,
  colors: PropTypes.object.isRequired,
}

export default LabeledMessagesButton
