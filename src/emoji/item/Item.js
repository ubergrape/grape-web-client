import React from 'react'
import useSheet from 'react-jss'

import Sensor from '../../components/sensor/Sensor'
import style from './style'

/**
 * One grid item.
 */
export default React.createClass({
  mixins: [useSheet(style)],

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
        onClick={this.onClick}
        className={focused ? classes.itemFocused : classes.item}
        key={id}>
        <Sensor
          onChange={this.onVisibilityChange}
          containment={this.visibilityContainmentNode}
          ref="sensor" />
        {icon}
      </div>
    )
  },

  checkVisibility() {
    this.refs.sensor.check()
  },

  onFocus() {
    this.props.onFocus({id: this.props.id})
  },

  onClick() {
    if (this.props.focused) this.props.onSelect({id: this.props.id})
    else this.onFocus()
  },

  onVisibilityChange(isVisible, visibilityRect) {
    if (!isVisible && this.props.focused) {
      this.props.onInvisible(this, visibilityRect)
    }
  }
})
