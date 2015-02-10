'use strict'

import React from 'react'
import useSheet from 'react-jss'
import smartcompleteStyle from './smartcompleteStyle'
import Facets from './Facets'
import * as services from '../services'
import clone from 'lodash-es/lang/clone'
import find from 'lodash-es/collection/find'
import findIndex from 'lodash-es/array/findIndex'

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
    var hasSelected = false
    var facets = this.state.data.map(function (section) {
      var selected = Boolean(section.selected)
      if (selected) hasSelected = true
      return {
        label: section.label,
        service: section.service,
        amount: section.results.length,
        selected: selected,
      }
    })

    if (facets[0] && facets[0].service != 'all') {
      var total = 0
      facets.forEach(facet => total += facet.amount)
      facets.unshift({
        label: 'All',
        service: 'all',
        amount: total,
        selected: !hasSelected
      })
    }

    return facets
  },

  selectFacet(service) {
    var data = this.state.data.map(function (section) {
      section = clone(section)
      section.selected = section.service == service
      return section
    })
    this.setState({data: data})
  },

  selectItem(id) {
    var data = this.state.data.map(function (section) {
      section = clone(section)

      var current = find(section.results, result => result.selected)
      if (current) current.selected = false

      var result = find(section.results, result => result.id == id)
      if (result) result.selected = true

      return section
    })
    this.setState({data: data})
  },

  unselectSelectedItem() {
    var data = this.state.data.map(function (section) {
      section = clone(section)

      var current = find(section.results, result => result.selected)
      if (current) current.selected = false
      return section
    })
    this.setState({data: data})
  },

  navigate(direction) {
    var facets = this.getFacets()
    var facetIndex = findIndex(facets, facet => facet.selected)

    var results = []

    var service = facets[facetIndex].service

    if (service == 'all') {
      this.state.data.forEach(section => results = results.concat(section.results))
    } else {
      results = find(
        this.state.data,
        section => section.service == service
      ).results
    }
    var resultIndex = findIndex(results, result => result.selected)

    switch(direction) {
      case 'down':
        if (resultIndex + 1 < results.length) resultIndex++
        if (results[resultIndex]) this.selectItem(results[resultIndex].id)
        break
      case 'up':
        resultIndex = resultIndex < 0 ? 0 : resultIndex - 1
        if (results[resultIndex]) this.selectItem(results[resultIndex].id)
        break
      case 'right':
        facetIndex++
        if (facets[facetIndex]) {
          this.selectFacet(facets[facetIndex].service)
          this.unselectSelectedItem()
        }
        break
      case 'left':
        facetIndex--
        if (facets[facetIndex]) {
          this.selectFacet(facets[facetIndex].service)
          this.unselectSelectedItem()
        }
        break
    }
  },

  render() {
    var classes = this.sheet.classes
    var data = this.state.data

    var selectedSection = find(data, section => section.selected)

    var service
    if (selectedSection) {
      if (!services[selectedSection.service]) throw new Error(`No service "${selectedSection.service}" found.`)
      service = React.createElement(services[selectedSection.service], {
        data: [selectedSection],
        select: this.selectItem
      })
    } else {
      service = React.createElement(services.all, {
        data: data,
        select: this.selectItem
      })
    }

    return (
      <smart-complete className={classes.container}>
        <Facets data={this.getFacets()} select={this.selectFacet} />
        {service}
      </smart-complete>
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

