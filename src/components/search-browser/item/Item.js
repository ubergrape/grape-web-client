import React, {Component, PropTypes} from 'react'
import ReactDOM from 'react-dom'
import moment from 'moment'
import VisibilitySensor from 'react-visibility-sensor'

import {useSheet} from 'grape-web/lib/jss'
import findMatches from 'grape-web/lib/search/findMatches'
import * as icons from 'grape-web/lib/svg-icons/data'
import * as style from './style'
import * as utils from './utils'

// Service/icon map for exceptions where service name doesn't match icon name.
// TODO it should be a service implementation detail.
const serviceIconMap = {
  googledrive: icons.googleDrive,
  gcal: icons.googleCalendar,
  filters: icons.magnifier
}

/**
 * One grid item.
 */
@useSheet(style.rules)
export default class Item extends Component {
  static propTypes = {
    sheet: PropTypes.object,
    focused: PropTypes.bool,
    sectionFocused: PropTypes.bool,
    visibilityContainment: PropTypes.instanceOf(Component),
    id: PropTypes.string,
    name: PropTypes.string,
    search: PropTypes.string,
    icon: PropTypes.string,
    info: PropTypes.string,
    detail: PropTypes.object,
    date: PropTypes.string,
    service: PropTypes.string,
    onFocus: PropTypes.func,
    onSelect: PropTypes.func,
    onInvisible: PropTypes.func
  }

  static defaultProps = {
    focused: false
  }

  componentDidMount() {
    this.visibilityContainmentNode = ReactDOM.findDOMNode(this.props.visibilityContainment)
  }

  componentDidUpdate(prevProps) {
    if (this.props.focused !== prevProps.focused) {
      this.refs.sensor.check()
      if (this.props.focused) this.onFocus()
    }
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

  renderName() {
    let {name} = this.props
    const matches = findMatches(name, this.props.search)

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

  render() {
    const {classes} = this.props.sheet
    const {focused, service, info} = this.props
    let containerClassName = focused ? classes.containerFocused : classes.container
    if (!this.props.sectionFocused && focused) {
      containerClassName = classes.containerFocusedInactive
    }
    const metaItemClassName = focused ? classes.metaItemFocused : classes.metaItem
    const state = utils.getLabel(this.props.detail)
    const iconUrl = icons[service] || serviceIconMap[service] || icons.file
    const iconStyle = {backgroundImage: `url(${iconUrl})`}
    return (
      <VisibilitySensor
        onChange={::this.onVisibilityChange}
        containment={this.visibilityContainmentNode}
        active={false}
        ref="sensor">
        <div
          onClick={::this.onClick}
          className={containerClassName}>
          <div className={classes.iconContainer}>
            <span className={classes.icon} style={iconStyle} />
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
}
