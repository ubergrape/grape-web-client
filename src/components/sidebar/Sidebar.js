import PropTypes from 'prop-types'
import React, {Component} from 'react'
import {shouldPureComponentUpdate} from 'react-pure-render'

import injectSheet from 'grape-web/lib/jss'
import style from './style'

/**
 * Sidebar container.
 */
@injectSheet(style)
export default class Sidebar extends Component {
  static propTypes = {
    sheet: PropTypes.object,
    className: PropTypes.string,
    children: PropTypes.element
  }

  static defaultProps = {
    className: ''
  }

  shouldComponentUpdate = shouldPureComponentUpdate

  render() {
    const {classes} = this.props.sheet

    return (
      <aside className={`${classes.sidebar} ${this.props.className}`}>
        {this.props.children}
      </aside>
    )
  }
}
