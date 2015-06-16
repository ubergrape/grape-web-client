import React from 'react'
import useSheet from 'react-jss'
import VisibilitySensor from 'react-visibility-sensor'

import style from './style'

/**
 * Visibility sensor wrapper.
 */
export default React.createClass({
  mixins: [useSheet(style)],

  getDefaultProps() {
    return {
      onChange: undefined,
      containment: undefined
    }
  },

  render() {
    return (
      <VisibilitySensor
        active={false}
        onChange={this.props.onChange}
        containment={this.props.containment}
        ref="sensor" >
        <div className={this.sheet.classes.sensor}></div>
      </VisibilitySensor>
    )
  },

  check() {
    return this.refs.sensor.check()
  }
})
