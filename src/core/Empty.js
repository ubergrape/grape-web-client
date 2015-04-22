import React from 'react'
import useSheet from 'react-jss'
import emptyStyle from './emptyStyle'

/**
 * Display information when list is empty
 */
export default React.createClass({
  mixins: [useSheet(emptyStyle)],

  getDefaultProps() {
    return {
      text: 'Nothing found.'
    }
  },

  render() {
    let {classes} = this.sheet
    return (
      <div className={classes.container}>
        <div className={classes.info}>{this.props.text}</div>
      </div>
    )
  }
})
