import PropTypes from 'prop-types'
import React, {PureComponent} from 'react'
import injectSheet from 'grape-web/lib/jss'

import {styles} from './theme'

/**
 * Dialog has
 * - header (title, close button)
 * - body
 * - positioned in the middle
 */
@injectSheet(styles)
export default class SidebarPanel extends PureComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    title: PropTypes.string.isRequired,
    onClose: PropTypes.func.isRequired,
    options: PropTypes.node,
    children: PropTypes.node
  }

  static defaultProps = {
    options: null,
    children: null
  }

  getClassName(className) {
    const {options, classes} = this.props
    return classes[`${className}${options ? 'Options' : ''}`]
  }

  render() {
    const {options, title, children, classes, onClose} = this.props
    return (
      <div className={classes.sidebarPanel}>
        <header className={this.getClassName('header')}>
          <h2 className={this.getClassName('title')}>
            {title}
          </h2>
          <button
            className={classes.close}
            onClick={onClose}
          />
        </header>
        {options}
        <div className={classes.body}>
          {children}
        </div>
      </div>
    )
  }
}
