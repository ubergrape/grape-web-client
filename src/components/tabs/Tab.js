import PropTypes from 'prop-types'
import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import VisibilitySensor from 'react-visibility-sensor'
import noop from 'lodash/utility/noop'
import {shouldPureComponentUpdate} from 'react-pure-render'

import injectSheet from 'grape-web/lib/jss'
import * as style from './tabStyle'

/**
 * One tab tab.
 */
@injectSheet(style.rules)
export default class Tab extends Component {
  static propTypes = {
    sheet: PropTypes.object,
    onSelect: PropTypes.func,
    onInvisible: PropTypes.func,
    selected: PropTypes.bool,
    visibilityContainment: PropTypes.instanceOf(Component),
    id: PropTypes.string,
    icon: PropTypes.element,
    amount: PropTypes.number,
    label: PropTypes.string
  }

  static defaultProps = {
    onSelect: noop,
    onInvisible: noop,
    selected: false
  }

  componentDidMount() {
    this.visibilityContainmentNode = ReactDOM.findDOMNode(this.props.visibilityContainment)
  }

  shouldComponentUpdate = shouldPureComponentUpdate

  componentDidUpdate(prevProps) {
    if (this.props.selected !== prevProps.selected) {
      this.refs.sensor.check()
    }
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

  checkVisibility() {
    this.refs.sensor.check()
  }

  render() {
    const {classes} = this.props.sheet
    const {icon, amount, label, selected} = this.props
    const className = selected ? classes.containerSelected : classes.container
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
}
