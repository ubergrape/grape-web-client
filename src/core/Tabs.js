import React from 'react'
import useSheet from 'react-jss'

import tabsStyle from './tabsStyle'
import Tab from './Tab'

/**
 * Tabs container.
 */
export default React.createClass({
  mixins: [useSheet(tabsStyle)],

  getDefaultProps() {
    return {
      data: null,
      onSelect: null,
      onInvisible: null
    }
  },

  render() {
    let {classes} = this.sheet

    return (
      <ul className={classes.tabs}>
        {this.props.data.map(item => {
          let facet = item.service || 'all'
          return <Tab
            {...item}
            onSelect={this.props.onSelect}
            onInvisible={this.props.onInvisible}
            visibilityContainment={this}
            key={facet}
            ref={facet} />
        })}
      </ul>
    )
  },

  checkVisibility(facet) {
    this.refs[facet].checkVisibility()
  }
})
