'use strict'

import React from 'react'
import useSheet from 'react-jss'
import smartcompleteStyle from './smartcompleteStyle'
import Facets from './Facets'
import * as services from '../services'
import clone from 'lodash-es/lang/clone'
import find from 'lodash-es/collection/find'

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
    var hasActive = false
    var facets = this.state.data.map(function (section) {
      var active = Boolean(section.active)
      if (active) hasActive = true
      return {
        label: section.label,
        service: section.service,
        amount: section.results.length,
        active: active
      }
    })

    if (facets[0] && facets[0].service != 'all') {
      var total = 0
      facets.forEach(function (facet) {
        total += facet.amount
      })
      facets.unshift({
        label: 'All',
        service: 'all',
        amount: total,
        active: !hasActive
      })
    }

    return facets
  },

  setActive(service) {
    var data = this.state.data.map(function (section) {
      section = clone(section)
      section.active = section.service == service
      return section
    })
    this.setState({data: data})
  },

  render() {
    var classes = this.sheet.classes

    var data = this.state.data

    var activeSection = find(data, function (section) {
      return section.active
    })

    var service
    if (activeSection) {
      if (!services[activeSection.service]) throw new Error(`No service "${activeSection.service}" found.`)
      service = React.createElement(services[activeSection.service], {data: [activeSection]})
    } else {
      service = React.createElement(services.all, {data: data})
    }

    return (
      <div className={classes.container}>
        <Facets data={this.getFacets()} setActive={this.setActive} />
        {service}
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

