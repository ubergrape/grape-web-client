'use strict'

import React from 'react'
import useSheet from 'react-jss'
import sectionStyle from './sectionStyle'
import Item from './Item'

/**
 * One list section which has a title and list items.
 */
var Section = React.createClass({
  mixins: [useSheet(sectionStyle)],

  render() {
    var classes = this.sheet.classes

    var items = this.props.results.map(function (result) {
      return <Item {...result} />
    })

    return (
      <section>
        <header>{this.props.label}</header>
        {items}
      </section>
    )
  }
})

export default Section
