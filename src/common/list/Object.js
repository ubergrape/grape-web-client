import React from 'react'
import useSheet from 'react-jss'
import VisibilitySensor from 'react-visibility-sensor'
import moment from 'moment'

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
      state: null,
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
    let metaItemClassName = focused ? classes.metaItemFocused : classes.metaItem
    // TODO: use svg icons, don't use global selectors.
    let iconClassNames = `fa fa-lg fa-${icon} ` + iconClassName
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
        <div className={classes.iconContainer}>
          <span className={iconClassNames}></span>
        </div>
        <div className={classes.nameContainer}>
          <div className={classes.name} dangerouslySetInnerHTML={{__html: highlighted}} />
          <div className={classes.info}>{info}</div>
        </div>
        <div className={classes.metaContainer}>
          {this.props.date &&
            <span className={metaItemClassName}>{moment(this.props.date).format('ddd, MMM D YYYY, h:mm a')}</span>
          }
          {this.props.state &&
            <span className={metaItemClassName}>{this.props.state}</span>
          }
        </div>
      </div>
    )
  },

  checkVisibility() {
    this.refs.sensor.check()
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
