'use strict'

import React from 'react'
import useSheet from 'react-jss'
import facetsStyle from './facetsStyle'

/**
 * Integrations tabs.
 */
var Facets = React.createClass({
  mixins: [useSheet(facetsStyle)],
  render() {
    var classes = this.sheet.classes
    var facets = this.props.data.map(function (facet) {
        var amount = facet.amount == null ? ' ' : ' (' + facet.amount + ')'
        return <li className={classes.item}>{facet.title}{amount}</li>
    })
    return <ul className={classes.container}>{facets}</ul>
  }
})

export default Facets
