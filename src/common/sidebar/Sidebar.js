import React from 'react'
import useSheet from 'react-jss'

import sidebarStyle from './sidebarStyle'

/**
 * Sidebar container.
 */
export default React.createClass({
  mixins: [useSheet(sidebarStyle)],

  getDefaultProps() {
    return {
      height: null,
      className: '',
      content: null
    }
  },

  render() {
    let {classes} = this.sheet

    let style = {
      height: `${this.props.height}px`
    }

    return (
      <aside className={`${classes.sidebar} ${this.props.className}`} style={style}>
        {this.props.content}
      </aside>
    )
  }
})
