import React from 'react'
import useSheet from 'react-jss'
import emptyStyle from './emptyStyle'

/**
 * Display information when list is empty
 */
export default React.createClass({
  mixins: [useSheet(emptyStyle)],

  render() {
    let {classes} = this.sheet
    return <div className={classes.container}>Nothing found.</div>
  }
})
