import React from 'react'
import useSheet from 'react-jss'

import style from './style'

/**
 * Sidebar container.
 */
export default React.createClass({
  mixins: [useSheet(style)],

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
