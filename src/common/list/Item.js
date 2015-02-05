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
    return (
      <div className={classes.container}>
        <span className={classes.name} dangerouslySetInnerHTML={{__html: this.props.highlighted}} />
        <span className={classes.info}>{this.props.info}</span>
      </div>
    )
  }
})

export default Item
