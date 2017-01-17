import React, {PureComponent, PropTypes} from 'react'
import injectSheet from 'grape-web/lib/jss'

import {styles} from './rowTheme.js'

@injectSheet(styles)
export default class Row extends PureComponent {
  static defaultProps = {
    spaced: false
  }

  render() {
    const {
      children,
      spaced,
      sheet: {classes}
    } = this.props

    return (
      <div className={(spaced ? classes.rowSpaced : classes.row)}>
        {children}
      </div>
    )
  }
}
