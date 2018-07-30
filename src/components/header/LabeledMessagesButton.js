import PropTypes from 'prop-types'
import React from 'react'
import { FormattedMessage } from 'react-intl'

import Tooltip from '../tooltip/HoverTooltip'
import FabButton from './FabButton'

const tip = (
  <FormattedMessage
    id="labeledMessagesTooltip"
    defaultMessage="Important Messages"
  />
)

const LabeledMessagesButton = ({ onClick, isSelected, disabled }) => (
  <Tooltip message={tip} align="right">
    <FabButton
      onClick={onClick}
      disabled={disabled}
      isSelected={isSelected}
      icon="tag"
    />
  </Tooltip>
)

LabeledMessagesButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  isSelected: PropTypes.bool.isRequired,
  disabled: PropTypes.bool.isRequired,
}

export default LabeledMessagesButton
