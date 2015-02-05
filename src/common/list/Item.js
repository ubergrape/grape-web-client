'use strict'

import React from 'react'
import useSheet from 'react-jss'
import itemStyle from './itemStyle'

/**
 * One result for the list section.
 */
var Item = React.createClass({
  mixins: [useSheet(itemStyle)],

  render() {
    var classes = this.sheet.classes
    return (
      <div>{this.props.name}</div>
    )
  }
})

export default Item
