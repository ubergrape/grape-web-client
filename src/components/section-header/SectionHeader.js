import React, {Component, PropTypes} from 'react'
import {useSheet} from 'grape-web/lib/jss'

import style from './style'

@useSheet(style)
export default class Service extends Component {
  static propTypes = {
    sheet: PropTypes.object.isRequired,
    text: PropTypes.string
  }

  render() {
    const {classes} = this.props.sheet
    return <header className={classes.header}>{this.props.text}</header>
  }
}
