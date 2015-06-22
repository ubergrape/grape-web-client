import React, {Component} from 'react'
import useSheet from 'react-jss'
import VisibilitySensor from 'react-visibility-sensor'
import {shouldPureComponentUpdate} from 'react-pure-render'

import * as style from './style'

/**
 * One grid item.
 */
@useSheet(style.rules)
export default class Item extends Component {
  static defaultProps = {
    id: undefined,
    icon: undefined,
    onFocus: undefined,
    onSelect: undefined,
    onInvisible: undefined,
    onDidMount: undefined,
    visibilityContainment: undefined,
    focused: false
  }

  shouldComponentUpdate = shouldPureComponentUpdate

  componentDidUpdate(prevProps) {
    if (this.props.focused != prevProps.focused) {
      this.refs.sensor.check()
      if (this.props.focused) this.onFocus()
    }
  }

  componentDidMount() {
    this.visibilityContainmentNode = React.findDOMNode(this.props.visibilityContainment)
    this.props.onDidMount(this)
  }

  render() {
    let {classes} = this.props.sheet
    let {id, icon, focused} = this.props
    return (
      <VisibilitySensor
        onChange={::this.onVisibilityChange}
        containment={this.visibilityContainmentNode}
        active={false}
        ref="sensor">
        <div
          className={focused ? classes.itemFocused : classes.item}
          onClick={::this.onClick}
          onMouseOver={::this.onMouseOver}
          key={id}>
          {icon}
        </div>
      </VisibilitySensor>
    )
  }

  onVisibilityChange(isVisible, visibilityRect) {
    if (!isVisible && this.props.focused) {
      this.props.onInvisible(this, visibilityRect)
    }
  }

  onFocus() {
    this.props.onFocus({id: this.props.id})
  }

  onClick() {
    this.props.onSelect({id: this.props.id})
  }

  onMouseOver() {
    this.onFocus()
  }
}
