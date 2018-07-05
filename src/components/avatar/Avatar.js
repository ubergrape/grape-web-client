import PropTypes from 'prop-types'
import React from 'react'
import noop from 'lodash/utility/noop'
import injectSheet from 'grape-web/lib/jss'

import { size } from './constants'

const styles = {
  avatar: {
    display: 'block',
    position: 'relative',
    width: size,
    height: size,
    flexShrink: 0,
    borderRadius: '50%',
    background: {
      repeat: 'no-repeat',
      position: 'center',
      size: '100%',
    },
  },
}

const Avatar = ({ className, src, onClick, classes, children, style }) => (
  <span
    className={`${classes.avatar} ${className}`}
    role="presentation"
    style={src ? { ...style, backgroundImage: `url(${src})` } : style}
    onClick={onClick}
  >
    {children}
  </span>
)

Avatar.propTypes = {
  classes: PropTypes.object.isRequired,
  onClick: PropTypes.func,
  src: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,
  children: PropTypes.node,
}

Avatar.defaultProps = {
  src: undefined,
  className: '',
  onClick: noop,
  style: {},
  children: undefined,
}

export default injectSheet(styles)(Avatar)
