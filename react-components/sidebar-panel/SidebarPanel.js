import React, {Component} from 'react'
import noop from 'lodash/utility/noop'
import {shouldPureComponentUpdate} from 'react-pure-render'

import style from './style'
import {useSheet} from 'grape-web/lib/jss'

/**
 * Dialog has
 * - header (title, close button)
 * - body
 * - positioned in the middle
 */
@useSheet(style)
export default class SidebarPanel extends Component {
  static defaultProps = {
    title: undefined,
    onClose: noop
  }

  shouldComponentUpdate = shouldPureComponentUpdate

  render() {
    let {classes} = this.props.sheet
    return (
      <div className={classes.sidebarPanel}>
        <header className={classes.header}>
          <h2 className={classes.title}>{this.props.title}</h2>
          <button className={classes.close} onClick={::this.onClose}></button>
        </header>
        <div className={classes.body}>
          {this.props.children}
        </div>
      </div>
    )
  }

  onClose() {
    this.props.onClose()
  }
}
