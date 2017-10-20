import PropTypes from 'prop-types'
import React from 'react'
import injectSheet from 'grape-web/lib/jss'
import {FormattedMessage} from 'react-intl'
import Icon from 'grape-web/lib/svg-icons/Icon'

import Tooltip from '../tooltip/HoverTooltip'
import {iconSize} from './constants'
import FabButton from './FabButton'

const styles = ({palette}) => ({
  icon: {
    width: iconSize,
    height: iconSize,
    cursor: 'inherit',
    color: ({isSelected}) => (isSelected ? palette.accent.A200 : palette.text.primary),
    '&:hover': {
      isolate: false,
      color: palette.accent.A200
    }
  },
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
    cursor: 'pointer'
  }
})

const tip = (
  <FormattedMessage
    id="mentions"
    defaultMessage="Mentions"
  />
)

const Mentions = ({classes, onClick, isSelected, mentions}) => (
  <Tooltip message={tip}>
    <FabButton onClick={onClick} isSelected={isSelected}>
      <Icon name="at" className={classes.icon} />
    </FabButton>
    {mentions > 0 && !isSelected && <i className={classes.badge} />}
  </Tooltip>
)

Mentions.propTypes = {
  classes: PropTypes.object.isRequired,
  onClick: PropTypes.func.isRequired,
  isSelected: PropTypes.bool.isRequired,
  mentions: PropTypes.number.isRequired
}

export default injectSheet(styles)(Mentions)
