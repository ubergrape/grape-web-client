import React from 'react'
import useSheet from 'react-jss'
import VisibilitySensor from 'react-visibility-sensor'

import * as objectStyle from './objectStyle'

/**
 * One result for the list section.
 */
export default React.createClass({
  mixins: [useSheet(objectStyle.style)],

  getDefaultProps() {
    return {
      id: null,
      date: null,
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
    let {id, focused, icon, info, highlighted} = this.props
    let containerClassName = focused ? classes.containerFocused : classes.container
    let iconClassName = focused ? classes.iconFocused : classes.icon
    let date
    if (this.props.date) {
      date = <span className={classes.date}>{this.getLocaleDateString()}</span>
    }
    // TODO: use svg icons, don't use global selectors.
    let iconClassNames = `fa fa-${icon} ` + iconClassName
    return (
      <div
        onClick={this.onClick}
        onMouseOver={this.onMouseOver}
        className={containerClassName}
        key={id}>
        <VisibilitySensor
          active={false}
          onChange={this.onVisibilityChange}
          className={classes.sensor}
          containment={this.visibilityContainmentNode}
          ref="sensor" />
        <span className={iconClassNames}></span>
        <span className={classes.name} dangerouslySetInnerHTML={{__html: highlighted}} />
        <span className={classes.info}>{info}</span>
        {date}
      </div>
    )
  },

  checkVisibility() {
    this.refs.sensor.check()
  },

  getLocaleDateString() {
    // TODO We need to centralize current locale constant.
    return this.props.date.toLocaleString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    })
  },

  onFocus() {
    this.props.onFocus({id: this.props.id})
  },

  onMouseOver() {
    this.onFocus()
  },

  onClick(e) {
    this.props.onSelect({id: this.props.id})
  },

  onVisibilityChange(isVisible, visibilityRect) {
    if (!isVisible && this.props.focused) {
      this.props.onInvisible(this, visibilityRect)
    }
  }
})
