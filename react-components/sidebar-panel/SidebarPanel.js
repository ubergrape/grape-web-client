import React, {Component} from 'react'
import noop from 'lodash/utility/noop'
import {shouldPureComponentUpdate} from 'react-pure-render'

import style from './style'
import {useSheet} from '../jss'

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
    isLoading: false,
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
        {this.props.children}
      </div>
    )
  }

  onClose() {
    this.props.onClose()
  }
}
