import React, {PureComponent, PropTypes} from 'react'
import injectSheet from 'grape-web/lib/jss'

import {styles} from './fieldTheme.js'

@injectSheet(styles)
export default class Field extends PureComponent {
  static propTypes = {
    title: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    sheet: PropTypes.object.isRequired
  }

  render() {
    const {
      title,
      value,
      sheet: {classes}
    } = this.props

    return (
      <div>
        <div className={classes.title}>{title}</div>
        <div className={classes.value}>{value}</div>
      </div>
    )
  }
}
