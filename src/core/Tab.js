import React from 'react'
import useSheet from 'react-jss'
import tabStyle from './tabStyle'

/**
 * One tab tab.
 */
export default React.createClass({
  mixins: [useSheet(tabStyle)],

  render() {
    let {classes} = this.sheet
    let {amount, label, selected} = this.props
    if (amount != null) label += ' (' + amount + ')'
    let className = selected ? classes.containerSelected : classes.container
    return <li className={className} onMouseDown={this.onMouseDown}>{label}</li>
  },

  onMouseDown(e) {
    // Important!!!
    // Avoids loosing focus and though caret position in editable.
    e.preventDefault()
    this.props.select(this.props.service)
  }
})
