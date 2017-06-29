import PropTypes from 'prop-types'
import React, {PureComponent} from 'react'
import noop from 'lodash/utility/noop'
import injectSheet from 'grape-web/lib/jss'
import {icon as iconSize} from 'grape-theme/dist/sizes'

@injectSheet({
  avatar: {
    display: 'block',
    position: 'relative',
    width: iconSize.l,
    height: iconSize.l,
    flexShrink: 0,
    borderRadius: '50%',
    background: {
      repeat: 'no-repeat',
      position: 'center',
      size: '100%'
    }
  }
})
export default class Avatar extends PureComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    onClick: PropTypes.func,
    src: PropTypes.string,
    className: PropTypes.string,
    style: PropTypes.object,
    children: PropTypes.node
  }

  static defaultProps = {
    src: undefined,
    className: '',
    onClick: noop,
    style: {},
    children: undefined
  }

  render() {
    const {className, src, onClick, classes, children} = this.props
    let {style} = this.props
    if (src) style = {...style, backgroundImage: `url(${src})`}

    return (
      <span
        className={`${classes.avatar} ${className}`}
        style={style}
        onClick={onClick}
      >
        {children}
      </span>
    )
  }
}
