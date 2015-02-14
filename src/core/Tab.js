'use strict'

import React from 'react'
import useSheet from 'react-jss'
import tabStyle from './tabStyle'

/**
 * One tab tab.
 */
var Tab = React.createClass({
  mixins: [useSheet(tabStyle)],

  render() {
    var classes = this.sheet.classes
    var label = this.props.label
    var amount = this.props.amount
    if (amount != null) label += ' (' + amount + ')'
    var className = this.props.selected ? classes.containerSelected : classes.container
    return <li className={className} onClick={this.onSelect}>{label}</li>
  },

  onSelect() {
    this.props.select(this.props.service)
  }
})

export default Tab
