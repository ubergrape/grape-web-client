import React from 'react'
import useSheet from 'react-jss'
import style from './style'

/**
 * Display information when grid is empty
 */
export default React.createClass({
  mixins: [useSheet(style)],

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
