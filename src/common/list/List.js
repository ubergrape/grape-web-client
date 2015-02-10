'use strict'

import React from 'react'
import useSheet from 'react-jss'
import Section from './Section'
import listStyle from './listStyle'
import cloneDeep from 'lodash-es/lang/cloneDeep'

/**
 * List for search results.
 */
var List = React.createClass({
  mixins: [useSheet(listStyle)],

  render() {
    if (!this.props.data.length) return null
    var classes = this.sheet.classes

    var sections = this.getSections().map(function (section) {
      return <Section {...section} select={this.props.select} />
    }, this)

    return <div className={classes.container}>{sections}</div>
  },

  getSections() {
    var data = cloneDeep(this.props.data)
    var section = data[0]
    var topResult = section.results.shift()

    // It was the only result in that section - remove that section.
    if (!section.results.length) data.shift()

    var topSection = {
        label: 'Top result',
        service: 'top',
        icon: section.icon,
        results: [topResult]
    }

    data.unshift(topSection)

    return data
  }
})

export default List
