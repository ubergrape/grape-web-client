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
    return <li className={className} onClick={this.onSelect}>{label}</li>
  },

  onSelect() {
    this.props.select(this.props.service)
  }
})
