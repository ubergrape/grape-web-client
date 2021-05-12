import PropTypes from 'prop-types'
import React from 'react'
import injectSheet from 'grape-web/lib/jss'
import { FormattedMessage } from 'react-intl'

import Tooltip from '../tooltip/HoverTooltip'
import FabButton from './FabButton'

const styles = ({ palette }) => ({
  badge: {
    position: 'absolute',
    boxSizing: 'content-box',
    top: 8,
    right: 8,
    width: 7,
    height: 7,
    background: palette.error[500],
    borderRadius: '50%',
    border: [1, 'solid', palette.background.paper],
    cursor: 'pointer',
  },
})

const tip = <FormattedMessage id="mentions" defaultMessage="Mentions" />

const MentionsButton = ({ classes, onClick, isSelected, mentions, colors }) => (
  <Tooltip message={tip}>
    <FabButton
      onClick={onClick}
      isSelected={isSelected}
      colors={colors}
      icon="at"
    />
    {mentions > 0 && !isSelected && <i className={classes.badge} />}
  </Tooltip>
)

MentionsButton.propTypes = {
  classes: PropTypes.object.isRequired,
  colors: PropTypes.object.isRequired,
  onClick: PropTypes.func.isRequired,
  isSelected: PropTypes.bool.isRequired,
  mentions: PropTypes.number.isRequired,
}

export default injectSheet(styles)(MentionsButton)
