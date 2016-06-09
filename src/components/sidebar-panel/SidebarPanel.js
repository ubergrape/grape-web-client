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
    sheet: PropTypes.object.isRequired,
    title: PropTypes.string.isRequired,
    options: PropTypes.node,
    children: PropTypes.node,
    onClose: PropTypes.func.isRequired
  }

  shouldComponentUpdate = shouldPureComponentUpdate

  onClose() {
    this.props.onClose()
  }

  getClassName(className) {
    const {options, sheet} = this.props
    const {classes} = sheet
    return classes[`${className}${options ? 'Options' : ''}`]
  }

  render() {
    const {options, title, children, sheet} = this.props
    const {classes} = sheet
    return (
      <div className={classes.sidebarPanel}>
        <header className={this.getClassName('header')}>
          <h2 className={this.getClassName('title')}>
            {title}
          </h2>
          <button
            className={classes.close}
            onClick={::this.onClose} />
        </header>
        {options}
        <div className={classes.body}>
          {children}
        </div>
      </div>
    )
  }
}
