import React, {Component, PropTypes} from 'react'
import {useSheet} from 'grape-web/lib/jss'

import style from './style'

@useSheet(style)
export default class Service extends Component {
  static propTypes = {
    sheet: PropTypes.object.isRequired,
    text: PropTypes.string,
    hint: PropTypes.string
  }

  render() {
    const {classes} = this.props.sheet
    const {text, hint} = this.props
    return (
      <header className={classes.header}>
        <span className={classes.text}>{text}</span>
        {hint && <span className={classes.hint}>{hint}</span>}
      </header>
    )
  }
}
