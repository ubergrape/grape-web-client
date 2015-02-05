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

  render() {
    var classes = this.sheet.classes

    var facets = this.props.data.map(function (facet) {
      return <Facet {...facet} setActive={this.props.setActive} />
    }, this)

    return <ul className={classes.container}>{facets}</ul>
  }
})

export default Facets
