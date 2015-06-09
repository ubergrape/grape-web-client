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
      className: '',
      content: null
    }
  },

  render() {
    let {classes} = this.sheet

    return (
      <aside className={`${classes.sidebar} ${this.props.className}`}>
        {this.props.content}
      </aside>
    )
  }
})
