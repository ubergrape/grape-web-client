'use strict'

import React from 'react'
import useSheet from 'react-jss'
import facetStyle from './facetStyle'

/**
 * One facet tab.
 */
var Facet = React.createClass({
  mixins: [useSheet(facetStyle)],

  render() {
    var classes = this.sheet.classes
    var label = this.props.label
    if (this.props.amount != null) label += ' (' + this.props.amount + ')'
    var className = this.props.selected ? classes.containerSelected : classes.container
    return <li className={className} onClick={this.onSelect}>{label}</li>
  },

  onSelect() {
    this.props.select(this.props.service)
  }
})

export default Facet
