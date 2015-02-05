'use strict'

import React from 'react'
import useSheet from 'react-jss'
import Section from './Section'

/**
 * List for search results.
 */
var List = React.createClass({
  render() {
    var sections = this.props.data.map(function (section) {
      return <Section {...section}/>
    })

    return <div>{sections}</div>
  }
})

export default List
