import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import noop from 'lodash/noop'
import injectSheet from 'grape-web/lib/jss'

import { size } from './constants'

class Avatar extends PureComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    onClick: PropTypes.func,
    src: PropTypes.string,
    type: PropTypes.string,
    className: PropTypes.string,
    style: PropTypes.object,
    children: PropTypes.node,
  }

  static defaultProps = {
    src: undefined,
    type: 'active',
    className: '',
    onClick: noop,
    style: {},
    children: undefined,
  }

  render() {
    const { className, src, type, onClick, classes, children } = this.props
    let { style } = this.props
    if (src) style = { ...style, backgroundImage: `url(${src})` }

    if (type === 'image') {
      return (
        <div className={`${classes.avatar} ${className}`} style={style}>
          {children}
        </div>
      )
    }

    return (
      <button
        className={`${classes.avatar} ${className}`}
        style={style}
        onClick={onClick}
      >
        {children}
      </button>
    )
  }
}
export default injectSheet({
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
})(Avatar)
