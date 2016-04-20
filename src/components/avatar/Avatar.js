import React, {Component, PropTypes} from 'react'
import {useSheet} from 'grape-web/lib/jss'

import {defaultSrc} from '../../constants/images'
import styles from './styles'

@useSheet(styles)
export default class Avatar extends Component {
  static propTypes = {
    src: PropTypes.string
  }

  static defaultProps = {
    src: defaultSrc
  }

  render() {
    const {classes} = this.props.sheet
    return (
      <div
        style={{backgroundImage: `url(${this.props.src})`}}
        className={classes.avatar}>
      </div>
    )
  }
}

