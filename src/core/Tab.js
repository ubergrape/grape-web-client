import React from 'react'
import useSheet from 'react-jss'
import VisibilitySensor from 'react-visibility-sensor'

import * as tabStyle from './tabStyle'

/**
 * One tab tab.
 */
export default React.createClass({
  mixins: [useSheet(tabStyle.style)],

  getDefaultProps() {
    return {
      onSelect: null,
      onInvisible: null,
      visibilityContainment: null,
      selected: false,
      label: null,
      amount: null
    }
  },

  componentWillMount() {
    this.visibilityContainmentNode = this.props.visibilityContainment.getDOMNode()
  },

  render() {
    let {classes} = this.sheet
    let {amount, label, selected} = this.props
    if (amount != null) label += ' (' + amount + ')'
    let className = selected ? classes.containerSelected : classes.container
    return (
      <li className={className} onMouseDown={this.onMouseDown}>
        <VisibilitySensor
          active={false}
          onChange={this.onVisibilityChange}
          className={classes.sensor}
          containment={this.visibilityContainmentNode}
          ref="sensor" />
        <span>{label}</span>
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
