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
      var time = <span className={classes.date}>{this.props.date.toLocaleString(this.options.date.locale, this.options.date.options)}</span>
    }

    return (
      <div onClick={this.onSelect} className={containerClassName}>
        <span className={classes.name} dangerouslySetInnerHTML={{__html: this.props.highlighted}} />
        <span className={classes.info}>{this.props.info}</span>
        {time}
      </div>
    )
  },

  onSelect() {
    this.props.select(this.props.id)
  }
})

export default Item
