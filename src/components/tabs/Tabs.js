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
      <div className={classes.tabs}>
        <ul className={classes.inner} ref="inner">
          {this.props.data.map(item => {
            let id = item.id || 'all'
            return <Tab
              {...item}
              onSelect={this.props.onSelect}
              onInvisible={this.props.onInvisible}
              visibilityContainment={this}
              key={id}
              ref={id} />
          })}
        </ul>
      </div>
    )
  },

  getInnerComponent() {
    return this.refs.inner
  },

  checkVisibility(id) {
    let tab = this.refs[id]
    if (tab) tab.checkVisibility()
  }
})
