import React, {Component} from 'react'
import useSheet from 'react-jss'

import style from './style'

/**
 * Sidebar container.
 */
@useSheet(style)
export default class Sidebar extends Component {
  static defaultProps = {
    className: '',
    content: undefined
  }

  render() {
    let {classes} = this.props.sheet

    return (
      <aside className={`${classes.sidebar} ${this.props.className}`}>
        {this.props.content}
      </aside>
    )
  }
}
