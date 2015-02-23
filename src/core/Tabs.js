import React from 'react'
import useSheet from 'react-jss'
import tabsStyle from './tabsStyle'
import Tab from './Tab'

/**
 * Tabs container.
 */
export default React.createClass({
  mixins: [useSheet(tabsStyle)],

  render() {
    let classes = this.sheet.classes
    let tabs = this.props.data.map(function (item) {
      return <Tab {...item} select={this.props.select} key={item.service || 'all'}/>
    }, this)

    return <ul className={classes.container}>{tabs}</ul>
  }
})
