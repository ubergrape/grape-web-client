import React from 'react'
import useSheet from 'react-jss'
import VisibilitySensor from 'react-visibility-sensor'

import * as tabStyle from './tabStyle'

/**
 * One tab tab.
 */
export default React.createClass({
  mixins: [useSheet(tabStyle.rules)],

  getDefaultProps() {
    return {
      onSelect: undefined,
      onInvisible: undefined,
      getContainmentNode: undefined,
      selected: false,
      icon: undefined,
      label: undefined,
      amount: undefined,
      id: undefined
    }
  },

  componentDidMount() {
    this.visibilityContainmentNode = this.props.visibilityContainment.getDOMNode()
  },

  render() {
    let {classes} = this.sheet
    let {icon, amount, label, selected} = this.props
    let className = selected ? classes.containerSelected : classes.container
    return (
      <VisibilitySensor
        onChange={this.onVisibilityChange}
        containment={this.visibilityContainmentNode}
        active={false}
        ref="sensor">
        <li className={className} onMouseDown={this.onMouseDown}>
          {icon}
          <span className={classes.text}>
            {label}
            {amount != null &&
              <span className={classes.amount}>{amount}</span>
            }
          </span>
        </li>
      </VisibilitySensor>
    )
  },

  checkVisibility() {
    this.refs.sensor.check()
  },

  onMouseDown(e) {
    // Important!!!
    // Avoids loosing focus and though caret position in editable.
    e.preventDefault()
    this.props.onSelect({id: this.props.id})
  },

  onVisibilityChange(isVisible, visibilityRect) {
    if (!isVisible && this.props.selected) {
      this.props.onInvisible(this, visibilityRect)
    }
  }
})
