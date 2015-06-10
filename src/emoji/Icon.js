import React from 'react'
import useSheet from 'react-jss'
import defaults from 'lodash-es/object/defaults'

import style from './iconStyle'

/**
 * Styled icon component.
 */
export default React.createClass({
  mixins: [useSheet(style)],

  getDefaultProps() {
    return {
      name: undefined,
      style: undefined,
      className: undefined
    }
  },

  render() {
    return (
      // Space inside is required for webkit browsers. Otherwise icon won't get
      // removed by backspace within contenteditable. Precondition is some text before.
      <i
        className={this.props.className || this.sheet.classes.icon}
        style={this.props.style}
        title={this.props.name}
        data-object={this.props.name}>
        {' '}
      </i>
    )
  }
})
