import React, {Component, PropTypes} from 'react'
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
  static propTypes = {
    sheet: PropTypes.object,
    title: PropTypes.string,
    children: PropTypes.node,
    onClose: PropTypes.func
  }

  shouldComponentUpdate = shouldPureComponentUpdate

  onClose() {
    this.props.onClose()
  }

  render() {
    const {classes} = this.props.sheet
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
}
