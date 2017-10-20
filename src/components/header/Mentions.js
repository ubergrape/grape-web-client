import PropTypes from 'prop-types'
import React from 'react'
import injectSheet from 'grape-web/lib/jss'
import {FormattedMessage} from 'react-intl'
import getColoredIcon from 'grape-web/lib/svg-icons/getColored'
import {white} from 'grape-theme/dist/base-colors'
import {alertDanger} from 'grape-theme/dist/web-colors'

import reset from '../button/reset'
import {iconSize} from './constants'
import Tooltip from '../tooltip/HoverTooltip'

const MentionsBadge = ({classes, mentions, isActive}) => {
  if (!mentions || isActive) return null
  return <i className={classes.badge} />
}

const tip = (
  <FormattedMessage
    id="mentions"
    defaultMessage="Mentions"
  />
)

const button = {
  ...reset,
  fontSize: iconSize,
  display: 'inline-block',
  width: 34,
  height: 34,
  borderRadius: '100%',
  background: 'no-repeat 50% 50%',
  backgroundSize: ['auto', iconSize],
  cursor: 'pointer',
  verticalAlign: 'middle'
}

const styles = ({palette}) => {
  const getIcon = (name, type) => {
    let color
    switch (type) {
      case 'hover':
        color = palette.accent.A200
        break
      case 'active':
        color = palette.accent.A200
        break
      default:
        color = palette.text.primary
    }
    return `url('${getColoredIcon({name, color})}')`
  }

  return {
    mentions: {
      ...button,
      backgroundImage: getIcon('at'),
      '&:hover': {
        isolate: false,
        backgroundImage: getIcon('at', 'hover')
      }
    },
    mentionsActive: {
      ...button,
      backgroundImage: getIcon('at', 'active')
    },
    badge: {
      position: 'absolute',
      boxSizing: 'content-box',
      top: 2,
      right: 2,
      width: 7,
      height: 7,
      background: alertDanger,
      borderRadius: '50%',
      border: [2, 'solid', white]
    }
  }
}

const Mentions = ({classes, onClick, isActive, mentions}) => (
  <Tooltip message={tip}>
    <button
      className={isActive ? classes.mentionsActive : classes.mentions}
      onClick={onClick}
    />
    <MentionsBadge
      mentions={mentions}
      isActive={isActive}
      classes={classes}
    />
  </Tooltip>
)

Mentions.propTypes = {
  classes: PropTypes.object.isRequired,
  onClick: PropTypes.func,
  isActive: PropTypes.bool,
  mentions: PropTypes.number
}

export default injectSheet(styles)(Mentions)
