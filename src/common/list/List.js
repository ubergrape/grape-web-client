'use strict'

import React from 'react'
import useSheet from 'react-jss'
import Section from './Section'
import listStyle from './listStyle'

/**
 * List for search results.
 */
var List = React.createClass({
  mixins: [useSheet(listStyle)],

  render() {
    var classes = this.sheet.classes
    var sections = this.props.data.map(function (section) {
      return <Section {...section} select={this.props.select} />
    }, this)

    return <div className={classes.container}>{sections}</div>
  }
})

export default List
