'use strict'

import React from 'react'
import useSheet from 'react-jss'
import facetStyle from './facetStyle'

/**
 * One facet tab.
 */
var Facet = React.createClass({
  mixins: [useSheet(facetStyle)],

  getInitialState() {
    return {
      active: false
    }
  },

  render() {
    var classes = this.sheet.classes
    var title = this.props.title
    if (this.props.results != null) title += ' (' + this.props.results + ')'
    var className = classes.container
    if (this.state.active) className = classes.containerActive
    return <li className={className} onClick={this.onActivate}>{title}</li>
  },

  onActivate() {
    this.props.setActive(this)
  }
})

export default Facet
