import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
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

class Avatar extends PureComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    onClick: PropTypes.func,
    src: PropTypes.string,
    className: PropTypes.string,
    style: PropTypes.object,
    children: PropTypes.node,
  }

  static defaultProps = {
    src: undefined,
    className: '',
    onClick: noop,
    style: {},
    children: undefined,
  }

  render() {
    const { className, src, onClick, classes, children } = this.props
    const style = src
      ? { ...this.props.style, backgroundImage: `url(${src})` }
      : this.props.style

    return (
      <span
        className={`${classes.avatar} ${className}`}
        role="presentation"
        style={style}
        onClick={onClick}
      >
        {children}
      </span>
    )
  }
}

export default injectSheet(styles)(Avatar)
