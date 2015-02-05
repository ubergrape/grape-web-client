'use strict'

import React from 'react'
import useSheet from 'react-jss'
import smartcompleteStyle from './smartcompleteStyle'
import Facets from './Facets'
import * as integrations from '../integrations'

/**
 * Main Smartcomplete class which uses everything else.
 */
var Smartcomplete = React.createClass({
  mixins: [useSheet(smartcompleteStyle)],

  getInitialState() {
    return {
      data: []
    }
  },

  getFacets() {
    var facets = this.state.data.map(function (result) {
      return {
        title: result.title,
        amount: result.items.length
      }
    })

    var total = 0
    facets.forEach(function (facet) {
      total += facet.amount
    })
    facets.unshift({
      title: 'All',
      amount: total
    })

    return facets
  },

  render() {
    var classes = this.sheet.classes

    var data = this.state.data

    /*
    var integrationComponents = data.map(function (result) {
      if (!integrations[result.type]) return
      return React.createElement(integrations[result.type], {data: [result]})
    })
    */
    var integrationComponents = []

    var All = React.createElement(integrations.All, {data: data})
    integrationComponents.unshift(All)

    return (
      <div className={classes.container}>
        <Facets data={this.getFacets()} />
        {integrationComponents[0]}
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

