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
    var containerClassName = this.props.selected ? classes.containerSelected : classes.container
    if (this.props.date) {
      var date = <span className={classes.date}>{this.getLocaleDateString()}</span>
    }
    // TODO: use svg icons, don't use global selectors.
    var iconClassNames = `fa fa-${this.props.icon} ` + classes.icon
    return (
      <div onClick={this.change} onMouseOver={this.select} className={containerClassName}>
        <span className={iconClassNames}></span>
        <span className={classes.name} dangerouslySetInnerHTML={{__html: this.props.highlighted}} />
        <span className={classes.info}>{this.props.info}</span>
        {date}
      </div>
    )
  },

  getLocaleDateString() {
    // TODO We need to centralize current locale constant.
    return this.props.date.toLocaleString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    })
  },

  select() {
    this.props.select(this.props.id)
  },

  change() {
    this.props.change(this.props.id)
  }
})

export default Item
