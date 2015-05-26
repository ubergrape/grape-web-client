import React from 'react'
import useSheet from 'react-jss'
import style from './style'

/**
 * Button component
 */
export default React.createClass({
  mixins: [useSheet(style)],

  getDefaultProps() {
    return {
      text: 'My Button',
      className: '',
      onClick: undefined
    }
  },

  render() {
    let {classes} = this.sheet
    return (
      <button
        onClick={this.props.onClick}
        className={`${classes.button} ${this.props.className}`}>
        {this.props.text}
      </button>
    )
  }
})
