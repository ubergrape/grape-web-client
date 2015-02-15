import React from 'react'
import useSheet from 'react-jss'
import tabStyle from './tabStyle'

/**
 * One tab tab.
 */
let Tab = React.createClass({
  mixins: [useSheet(tabStyle)],

  render() {
    let classes = this.sheet.classes
    let label = this.props.label
    let amount = this.props.amount
    if (amount != null) label += ' (' + amount + ')'
    let className = this.props.selected ? classes.containerSelected : classes.container
    return <li className={className} onClick={this.onSelect}>{label}</li>
  },

  onSelect() {
    this.props.select(this.props.service)
  }
})

export default Tab
