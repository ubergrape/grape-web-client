'use strict'

import React from 'react'
import useSheet from 'react-jss'
import sectionStyle from './sectionStyle'
import Item from './Item'
import assign from 'lodash-es/object/assign'
import pick from 'lodash-es/object/pick'

/**
 * One list section which has a title and list items.
 */
var Section = React.createClass({
  mixins: [useSheet(sectionStyle)],

  render() {
    var classes = this.sheet.classes

    var items = this.props.results.map(function (result) {
      assign(result, pick(this.props, 'select', 'change', 'icon'))
      return <Item {...result} />
    }, this)

    return (
      <section>
        <header className={classes.header}>{this.props.label}</header>
        {items}
      </section>
    )
  }
})

export default Section
