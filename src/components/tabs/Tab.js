import React from 'react'
import useSheet from 'react-jss'

import * as tabStyle from './tabStyle'
import Sensor from '../sensor/Sensor'

/**
 * One tab tab.
 */
export default React.createClass({
  mixins: [useSheet(tabStyle.style)],

  getDefaultProps() {
    return {
      onSelect: null,
      onInvisible: null,
      getContainmentNode: null,
      selected: false,
      label: null,
      amount: null
    }
  },

  componentDidMount() {
    this.visibilityContainmentNode = this.props.visibilityContainment.getDOMNode()
  },

  render() {
    let {classes} = this.sheet
    let {amount, label, selected} = this.props
    let className = selected ? classes.containerSelected : classes.container
    return (
      <li className={className} onMouseDown={this.onMouseDown}>
        <Sensor
          onChange={this.onVisibilityChange}
          containment={this.visibilityContainmentNode}
          ref="sensor" />
        <span className={classes.text}>
          {label}
          {amount != null &&
            <span className={classes.amount}>{amount}</span>
          }
        </span>
      </li>
    )
  },

  checkVisibility() {
    this.refs.sensor.check()
  },

  onMouseDown(e) {
    // Important!!!
    // Avoids loosing focus and though caret position in editable.
    e.preventDefault()
    this.props.onSelect({facet: this.props.service})
  },

  onVisibilityChange(isVisible, visibilityRect) {
    if (!isVisible && this.props.selected) {
      this.props.onInvisible(this, visibilityRect)
    }
  }
})
