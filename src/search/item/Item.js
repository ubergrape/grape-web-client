import React from 'react'
import useSheet from 'react-jss'
import moment from 'moment'

import * as style from './style'
import * as utils from './utils'
import Sensor from '../../components/sensor/Sensor'

/**
 * One grid item.
 */
export default React.createClass({
  mixins: [useSheet(style.style)],

  getDefaultProps() {
    return {
      id: null,
      date: null,
      detail: null,
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
    let iconClassName = focused ? classes.iconFocused : classes.icon
    let metaItemClassName = focused ? classes.metaItemFocused : classes.metaItem
    // TODO: use svg icons, don't use global selectors.
    let iconClassNames = `fa fa-lg fa-${icon} ` + iconClassName
    let state = utils.getState(this.props.detail)

    return (
      <div
        onClick={this.onClick}
        className={focused ? classes.containerFocused : classes.container}
        key={id}>
        <Sensor
          onChange={this.onVisibilityChange}
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
            <span className={metaItemClassName}>
              {moment(this.props.date).format('ddd, MMM D YYYY, h:mm a')}
            </span>
          }
          {state &&
            <span className={metaItemClassName}>{state}</span>
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
