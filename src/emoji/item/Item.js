import React from 'react'
import useSheet from 'react-jss'
import VisibilitySensor from 'react-visibility-sensor'

import * as style from './style'

/**
 * One grid item.
 */
export default React.createClass({
  mixins: [useSheet(style.rules)],

  getDefaultProps() {
    return {
      id: undefined,
      icon: undefined,
      onFocus: undefined,
      onSelect: undefined,
      onInvisible: undefined,
      visibilityContainment: undefined,
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
      <VisibilitySensor
        onChange={this.onVisibilityChange}
        containment={this.visibilityContainmentNode}
        active={false}
        ref="sensor">
        <div
          className={focused ? classes.itemFocused : classes.item}
          onClick={this.onClick}
          onMouseOver={this.onMouseOver}
          key={id}>
          {icon}
        </div>
      </VisibilitySensor>
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
