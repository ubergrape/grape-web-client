import React, {Component, PropTypes} from 'react'
import {useSheet} from 'grape-web/lib/jss'

import {defaultAvatar} from '../../constants/images'
import styles from './styles'

@useSheet(styles)
export default class Avatar extends Component {
  static propTypes = {
    sheet: PropTypes.object.isRequired,
    src: PropTypes.string,
    className: PropTypes.string,
    style: PropTypes.object,
    children: PropTypes.node
  }

  static defaultProps = {
    src: defaultAvatar,
    className: '',
    style: {}
  }

  render() {
    const {classes} = this.props.sheet
    const {className, src} = this.props
    const style = {...this.props.style}
    if (src) style.backgroundImage = `url(${src})`

    return (
      <span
        className={`${classes.avatar} ${className}`}
        style={style}>
        {this.props.children}
      </span>
    )
  }
}
