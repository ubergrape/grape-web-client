import React, {Component, PropTypes} from 'react'
import {useSheet} from 'grape-web/lib/jss'
import noop from 'lodash/utility/noop'

import {defaultAvatar} from '../../constants/images'
import styles from './styles'

@useSheet(styles)
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

  render() {
    const {className, src, onClick, sheet, children} = this.props
    const {classes} = sheet
    const style = {...this.props.style}
    if (src) style.backgroundImage = `url(${src})`

    return (
      <span
        onClick={onClick}
        className={`${classes.avatar} ${className}`}
        style={style}
        onClick={onClick}>
        {children}
      </span>
    )
  }
}
