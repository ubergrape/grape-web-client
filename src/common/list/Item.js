'use strict'

import React from 'react'
import useSheet from 'react-jss'
import itemStyle from './itemStyle'

/**
 * One result for the list section.
 */
var Item = React.createClass({
  mixins: [useSheet(itemStyle)],

  options: {
    date: {
      locale: 'en-US',
      options: {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric'
      }
    }
  },

  render() {
    var classes = this.sheet.classes
    var containerClassName = this.props.selected ? classes.containerSelected : classes.container
    if (this.props.date) {
      var date = <span className={classes.date}>{this.getLocaleDateString()}</span>
    }
    // Todo use svg icons.
    var iconClassNames = `fa fa-${this.props.icon} ` + classes.icon
    return (
      <div onClick={this.select} onMouseOver={this.select} className={containerClassName}>
        <span className={iconClassNames}></span>
        <span className={classes.name} dangerouslySetInnerHTML={{__html: this.props.highlighted}} />
        <span className={classes.info}>{this.props.info}</span>
        {date}
      </div>
    )
  },

  getLocaleDateString() {
      return this.props.date.toLocaleString(
        this.options.date.locale,
        this.options.date.options
      )
  },

  select() {
    this.props.select(this.props.id)
  }
})

export default Item
