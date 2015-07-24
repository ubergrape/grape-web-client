import React, {Component} from 'react'
import moment from 'moment'
import VisibilitySensor from 'react-visibility-sensor'
import {shouldPureComponentUpdate} from 'react-pure-render'

import {useSheet} from '../../jss'
import * as style from './style'
import * as utils from './utils'

/**
 * One grid item.
 */
@useSheet(style.rules)
export default class Item extends Component {
  static defaultProps = {
    id: undefined,
    name: undefined,
    date: undefined,
    detail: undefined,
    onFocus: undefined,
    onSelect: undefined,
    onInvisible: undefined,
    visibilityContainment: undefined,
    focused: false
  }

  shouldComponentUpdate = shouldPureComponentUpdate

  componentDidUpdate(prevProps) {
    if (this.props.focused !== prevProps.focused) {
      this.refs.sensor.check()
      if (this.props.focused) this.onFocus()
    }
  }

  componentDidMount() {
    this.visibilityContainmentNode = React.findDOMNode(this.props.visibilityContainment)
  }

  render() {
    let {classes} = this.props.sheet
    let {focused, icon, info} = this.props
    let iconClassName = focused ? classes.iconFocused : classes.icon
    let metaItemClassName = focused ? classes.metaItemFocused : classes.metaItem
    // TODO: use svg icons, don't use global selectors.
    let iconClassNames = `fa fa-lg fa-${icon} ` + iconClassName
    let state = utils.getState(this.props.detail)
    return (
      <VisibilitySensor
        onChange={::this.onVisibilityChange}
        containment={this.visibilityContainmentNode}
        active={false}
        ref="sensor">
        <div
          onClick={::this.onClick}
          className={focused ? classes.containerFocused : classes.container}>
          <div className={classes.iconContainer}>
            <span className={iconClassNames}></span>
          </div>
          <div className={classes.nameContainer}>
            <div className={classes.name}>
              {this.renderName()}
            </div>
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
      </VisibilitySensor>
    )
  }

  renderName() {
    let {name} = this.props
    let matches = utils.findMatches(name, this.props.search)

    if (matches.length) {
      name = matches.map((match, i) =>
        React.createElement(
          match.found ? 'b' : 'span',
          {key: i},
          match.text
        )
      )
    }

    return name
  }

  onFocus() {
    this.props.onFocus({id: this.props.id})
  }

  onClick() {
    if (this.props.focused) this.props.onSelect({id: this.props.id})
    else this.onFocus()
  }

  onVisibilityChange(isVisible, visibilityRect) {
    if (!isVisible && this.props.focused) {
      this.props.onInvisible(this, visibilityRect)
    }
  }
}
