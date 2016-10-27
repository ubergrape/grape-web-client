import React, {Component, PropTypes} from 'react'
import injectSheet from 'grape-web/lib/jss'
import noop from 'lodash/utility/noop'
import shallowCompare from 'react-addons-shallow-compare'

import {defaultAvatar} from '../../constants/images'
import {styles} from './theme'

@injectSheet(styles)
export default class Avatar extends Component {
  static propTypes = {
    sheet: PropTypes.object.isRequired,
    onClick: PropTypes.func.isRequired,
    src: PropTypes.string,
    className: PropTypes.string,
    style: PropTypes.object,
    children: PropTypes.node
  }

  static defaultProps = {
    src: defaultAvatar,
    className: '',
    onClick: noop,
    style: {}
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  }

  render() {
    const {className, src, onClick, sheet: {classes}, children} = this.props
    const style = {...this.props.style}
    if (src) style.backgroundImage = `url(${src})`

    return (
      <span
        className={`${classes.avatar} ${className}`}
        style={style}
        onClick={onClick}>
        {children}
      </span>
    )
  }
}
