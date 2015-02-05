'use strict'

import React from 'react'
import useSheet from 'react-jss'
import listStyle from './listStyle'

/**
 * List for search results.
 */
var List = React.createClass({
  mixins: [useSheet(listStyle)],

  render() {
    var classes = this.sheet.classes
    var items = this.props.data.map(function (item) {
        return <div/>
    })
    return <div>{items}</div>
  }
})

export default List
