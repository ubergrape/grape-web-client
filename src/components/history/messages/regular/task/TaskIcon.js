import PropTypes from 'prop-types'
import React from 'react'
import cn from 'classnames'
import Icon from 'grape-web/lib/svg-icons/Icon'
import injectSheet from 'grape-web/lib/jss'
import { small } from 'grape-theme/dist/fonts'
import { grayLight, orange, green } from 'grape-theme/dist/base-colors'

const styles = {
  taskIcon: {
    position: 'relative',
    display: 'inline-block',
  },
  lightningBolt: {
    fill: grayLight,
    height: small.fontSize,
  },
  lightningBoltConnected: {
    fill: orange,
  },
  checkCircle: {
    position: 'absolute',
    left: 5,
    top: -3,
    fill: green,
    height: '0.8em',
  },
}

const TaskIcon = ({ classes, isConnected, className, onClick }) =>
  isConnected ? (
    <span
      className={cn(classes.taskIcon, className)}
      onClick={onClick}
      role="presentation"
    >
      <Icon
        name="lightningBolt"
        className={cn(classes.lightningBolt, classes.lightningBoltConnected)}
      />
      <Icon name="checkCircle" className={classes.checkCircle} />
    </span>
  ) : (
    <Icon
      name="lightningBolt"
      className={cn(classes.lightningBolt, className)}
      onClick={onClick}
    />
  )

TaskIcon.propTypes = {
  classes: PropTypes.object.isRequired,
  isConnected: PropTypes.bool,
  className: PropTypes.string,
  onClick: PropTypes.func,
}

TaskIcon.defaultProps = {
  isConnected: false,
  className: null,
  onClick: null,
}

export default injectSheet(styles)(TaskIcon)
