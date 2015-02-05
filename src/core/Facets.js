'use strict'

import React from 'react'
import useSheet from 'react-jss'
import facetsStyle from './facetsStyle'
import Facet from './Facet'

/**
 * Facets container.
 */
var Facets = React.createClass({
  mixins: [useSheet(facetsStyle)],

  setActive(facet) {
    if (this.active) this.active.setState({active: false})
    facet.setState({active: true})
    this.active = facet
  },

  render() {
    var classes = this.sheet.classes

    var facets = this.props.data.map(function (facet) {
      return <Facet title={facet.title} amount={facet.amount} setActive={this.setActive}/>
    }, this)

    return <ul className={classes.container}>{facets}</ul>
  }
})

export default Facets
