import React, {PureComponent, PropTypes} from 'react'
import injectSheet from 'grape-web/lib/jss'

import {styles} from './rowTheme.js'

@injectSheet(styles)
export default class Row extends PureComponent {
  static propTypes = {
    children: PropTypes.node,
    spaced: PropTypes.bool.isRequired,
    sheet: PropTypes.object.isRequired
  }

  static defaultProps = {
    spaced: false,
    children: null
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
