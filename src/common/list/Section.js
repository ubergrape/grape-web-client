'use strict'

import React from 'react'
import useSheet from 'react-jss'
import assign from 'lodash-es/object/assign'
import pick from 'lodash-es/object/pick'

import sectionStyle from './sectionStyle'
import Object from './Object'

/**
 * One list section which has a title and list objects.
 */
var Section = React.createClass({
  mixins: [useSheet(sectionStyle)],

  render() {
    var classes = this.sheet.classes

    var objects = this.props.results.map(function (result) {
      assign(result, pick(this.props, 'select', 'pick', 'icon'))
      return <Object {...result} />
    }, this)

    return (
      <section>
        <header className={classes.header}>{this.props.label}</header>
        {objects}
      </section>
    )
  }
})

export default Section
