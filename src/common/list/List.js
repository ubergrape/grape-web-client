import React from 'react'
import useSheet from 'react-jss'
import cloneDeep from 'lodash-es/lang/cloneDeep'
import assign from 'lodash-es/object/assign'
import pick from 'lodash-es/object/pick'

import Section from './Section'
import listStyle from './listStyle'

/**
 * List for search results.
 */
let List = React.createClass({
  mixins: [useSheet(listStyle)],

  render() {
    if (!this.props.data.length) return null
    let classes = this.sheet.classes

    let sections = this.getSections().map(function (section) {
      assign(section, pick(this.props, 'focus', 'select'))
      return <Section {...section}  key={section.service}/>
    }, this)

    return <div className={classes.container}>{sections}</div>
  },

  getSections() {
    let data = cloneDeep(this.props.data)
    let section = data[0]
    let topResult = section.results.shift()

    // It was the only result in that section - remove that section.
    if (!section.results.length) data.shift()

    let topSection = {
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
