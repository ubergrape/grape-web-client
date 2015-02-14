'use strict'

import React from 'react'
import useSheet from 'react-jss'
import tabsStyle from './tabsStyle'
import Tab from './Tab'

/**
 * Tabs container.
 */
var Tabs = React.createClass({
  mixins: [useSheet(tabsStyle)],

  render() {
    var classes = this.sheet.classes
    var tabs = this.props.data.map(function (item) {
      return <Tab {...item} select={this.props.select} key={item.service || 'all'}/>
    }, this)

    return <ul className={classes.container}>{tabs}</ul>
  }
})

export default Tabs
