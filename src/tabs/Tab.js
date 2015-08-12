import React, {Component} from 'react'
import VisibilitySensor from 'react-visibility-sensor'
import noop from 'lodash/utility/noop'
import {shouldPureComponentUpdate} from 'react-pure-render'

import {useSheet} from '../jss'
import * as style from './tabStyle'

/**
 * One tab tab.
 */
@useSheet(style.rules)
export default class Tab extends Component {
  static defaultProps = {
    onSelect: noop,
    onInvisible: noop,
    getContainmentNode: undefined,
    selected: false,
    icon: undefined,
    label: undefined,
    amount: undefined,
    id: undefined
  }

  shouldComponentUpdate = shouldPureComponentUpdate

  componentDidMount() {
    this.visibilityContainmentNode = React.findDOMNode(this.props.visibilityContainment)
  }

  componentDidUpdate(prevProps) {
    if (this.props.selected !== prevProps.selected) {
      this.refs.sensor.check()
    }
  }

  render() {
    let {classes} = this.props.sheet
    let {icon, amount, label, selected} = this.props
    let className = selected ? classes.containerSelected : classes.container
    return (
      <VisibilitySensor
        onChange={::this.onVisibilityChange}
        containment={this.visibilityContainmentNode}
        active={false}
        ref="sensor">
        <li className={className} onMouseDown={::this.onMouseDown}>
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
  }

  checkVisibility() {
    this.refs.sensor.check()
  }

  onMouseDown(e) {
    // Important!!!
    // Avoids loosing focus and though caret position in editable.
    e.preventDefault()
    this.props.onSelect({id: this.props.id})
  }

  onVisibilityChange(isVisible, visibilityRect) {
    if (!isVisible && this.props.selected) {
      this.props.onInvisible(this, visibilityRect)
    }
  }
}
