'use strict'

import React from 'react'
import useSheet from 'react-jss'
import smartcompleteStyle from './smartcompleteStyle'
import Facets from './Facets'

/**
 * Main Smartcomplete class which uses everything else.
 */
var Smartcomplete = React.createClass({
  mixins: [useSheet(smartcompleteStyle)],

  getInitialState() {
    return {
      facets: []
    }
  },

  render() {
    var classes = this.sheet.classes
    return (
      <div className={classes.container}>
        <Facets data={this.state.facets} />
      </div>
    )
  }
})

/**
 * Render smartcomplete as a component when used bundled with react.
 *
 * @param {Element}
 * @api public
 */
Smartcomplete.create = function (element) {
  return React.render(<Smartcomplete />, element)
}

export default Smartcomplete

