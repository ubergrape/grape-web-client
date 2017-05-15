import PropTypes from 'prop-types'
import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import VisibilitySensor from 'react-visibility-sensor'
import {shouldPureComponentUpdate} from 'react-pure-render'

import injectSheet from 'grape-web/lib/jss'
import * as style from './style'

/**
 * One grid item.
 */
@injectSheet(style.rules)
export default class Item extends Component {
  static propTypes = {
    sheet: PropTypes.object.isRequired,
    onFocus: PropTypes.func,
    onSelect: PropTypes.func,
    onDidMount: PropTypes.func,
    onWillUnmount: PropTypes.func,
    onInvisible: PropTypes.func,
    visibilityContainment: PropTypes.object
  }

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

  componentDidMount() {
    this.visibilityContainmentNode = ReactDOM.findDOMNode(this.props.visibilityContainment)
    this.props.onDidMount(this)
  }

  componentWillReceiveProps(newProps) {
    this.setState({...newProps})
  }

  shouldComponentUpdate = shouldPureComponentUpdate

  componentDidUpdate(prevProps, prevState) {
    if (this.state.focused !== prevState.focused) {
      this.refs.sensor.check()
      if (this.state.focused) this.onFocus()
    }
  }

  componentWillUnmount() {
    this.props.onWillUnmount(this)
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

  render() {
    const {classes} = this.props.sheet
    const {id, icon, focused} = this.state

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
}
