import React, {Component} from 'react'
import VisibilitySensor from 'react-visibility-sensor'
import {shouldPureComponentUpdate} from 'react-pure-render'

import {useSheet} from '../../jss'
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
    onWillUnmount: undefined,
    visibilityContainment: undefined,
    focused: false
  }

  constructor(props) {
    super(props)
    this.state = {...props}
  }

  shouldComponentUpdate = shouldPureComponentUpdate

  componentWillReceiveProps(newProps) {
    this.setState({...newProps})
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.focused !== prevState.focused) {
      this.refs.sensor.check()
      if (this.state.focused) this.onFocus()
    }
  }

  componentDidMount() {
    this.visibilityContainmentNode = React.findDOMNode(this.props.visibilityContainment)
    this.props.onDidMount(this)
  }

  componentWillUnmount() {
    this.props.onWillUnmount(this)
  }

  render() {
    let {classes} = this.props.sheet
    let {id, icon, focused} = this.state
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
    if (!isVisible && this.state.focused) {
      this.props.onInvisible(this, visibilityRect)
    }
  }

  onFocus() {
    this.props.onFocus({id: this.state.id})
  }

  onClick() {
    this.props.onSelect({id: this.state.id})
  }

  onMouseOver() {
    this.onFocus()
  }
}
