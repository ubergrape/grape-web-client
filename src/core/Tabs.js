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
    let {classes} = this.sheet
    let {data, onSelect} = this.props

    let tabs = data.map(function (item) {
      return <Tab {...item} onSelect={onSelect} key={item.service || 'all'}/>
    })

    return <ul className={classes.container}>{tabs}</ul>
  }
})
