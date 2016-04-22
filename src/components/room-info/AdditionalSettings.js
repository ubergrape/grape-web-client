import React, {Component, PropTypes} from 'react'
import Dropdown from '../dropdown/Dropdown'
import * as tooltipStyle from '../tooltip/themes/gray'

export default class AdditionalSettings extends Component {
  static propTypes = {
    className: PropTypes.string
  }

  constructor() {
    super()
    this.state = {
      dropdownOpened: false
    }
  }

  onClick() {
    if (!this.state.dropdownOpened) {
      setTimeout(() => {
        this.setState({dropdownOpened: true})
      })
    }
  }

  onClickOutsideDropdown() {
    this.setState({dropdownOpened: false})
  }

  renderDropDown() {
    if (!this.state.dropdownOpened) return null
    return (
      <Dropdown
      container={this}
      theme={tooltipStyle}
      target={this.refs.settings}
      onClickOutside={::this.onClickOutsideDropdown}>
        hello kitty
      </Dropdown>
    )
  }

  render() {
    return (
      <div className={this.props.className}>
        <button onClick={::this.onClick} ref="settings">(**)</button>
        {this.renderDropDown()}
      </div>
    )
  }
}
