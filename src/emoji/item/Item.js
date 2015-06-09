import React from 'react'
import useSheet from 'react-jss'

import Sensor from '../../components/sensor/Sensor'
import * as style from './style'

/**
 * One grid item.
 */
export default React.createClass({
  mixins: [useSheet(style.rules)],

  getDefaultProps() {
    return {
      id: null,
      icon: null,
      onFocus: null,
      onSelect: null,
      onInvisible: null,
      visibilityContainment: null,
      focused: false
    }
  },

  componentDidUpdate(prevProps) {
    if (this.props.focused && !prevProps.focused) this.onFocus()
  },

  componentDidMount() {
    this.visibilityContainmentNode = this.props.visibilityContainment.getDOMNode()
  },

  render() {
    let {classes} = this.sheet
    let {id, icon, focused} = this.props
    return (
      <div
        className={focused ? classes.itemFocused : classes.item}
        onClick={this.onClick}
        onMouseOver={this.onMouseOver}
        key={id}>
        {focused && <Sensor
          onChange={this.onVisibilityChange}
          containment={this.visibilityContainmentNode}
          ref="sensor" />}
        {icon}
      </div>
    )
  },

  checkVisibility() {
    let {sensor} = this.refs
    if (sensor) sensor.check()
  },

  onVisibilityChange(isVisible, visibilityRect) {
    if (!isVisible && this.props.focused) {
      this.props.onInvisible(this, visibilityRect)
    }
  },

  onFocus() {
    this.props.onFocus({id: this.props.id})
  },

  onClick() {
    this.props.onSelect({id: this.props.id})
  },

  onMouseOver: function() {
    this.onFocus()
  }
})
