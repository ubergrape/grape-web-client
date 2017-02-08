import React, {PureComponent, PropTypes} from 'react'
import injectSheet from 'grape-web/lib/jss'
import cn from 'classnames'

import {styles} from './rowTheme.js'

@injectSheet(styles)
export default class Row extends PureComponent {
  static propTypes = {
    children: PropTypes.node,
    spaced: PropTypes.bool.isRequired,
    className: PropTypes.string.isRequired,
    sheet: PropTypes.object.isRequired
  }

  static defaultProps = {
    spaced: false,
    children: null,
    className: ''
  }

  render() {
    const {
      children,
      spaced,
      className,
      sheet: {classes}
    } = this.props

    return (
      <div className={cn(spaced ? classes.rowSpaced : classes.row, className)}>
        {children}
      </div>
    )
  }
}
