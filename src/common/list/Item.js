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

    return (
      <div onClick={this.onSelect} className={containerClassName}>
        <span className={classes.name} dangerouslySetInnerHTML={{__html: this.props.highlighted}} />
        <span className={classes.info}>{this.props.info}</span>
      </div>
    )
  },

  onSelect() {
    this.props.select(this.props.id)
  }
})

export default Item
