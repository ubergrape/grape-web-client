import React, {Component, PropTypes, createElement} from 'react'
import noop from 'lodash/utility/noop'
import moment from 'moment'

import injectSheet from 'grape-web/lib/jss'
import findMatches from 'grape-web/lib/search/findMatches'
import * as style from './style'
import * as utils from './utils'
import ServiceIcon from '../service-icon/ServiceIcon'

/**
 * One result.
 */
@injectSheet(style.rules)
export default class Result extends Component {
  static propTypes = {
    sheet: PropTypes.object,
    isFocused: PropTypes.bool,
    isViewFocused: PropTypes.bool,
    id: PropTypes.string,
    name: PropTypes.string,
    search: PropTypes.string,
    info: PropTypes.string,
    detail: PropTypes.object,
    date: PropTypes.string,
    service: PropTypes.string,
    onFocus: PropTypes.func,
    onSelect: PropTypes.func
  }

  static defaultProps = {
    isFocused: false,
    onFocus: noop,
    onSelect: noop
  }

  onClick = () => {
    if (this.props.isFocused) this.props.onSelect()
    else this.props.onFocus()
  }

  renderName() {
    let {name} = this.props
    const matches = findMatches(name, this.props.search)

    if (matches.length) {
      name = matches.map((match, i) =>
        createElement(
          match.found ? 'b' : 'span',
          {key: i},
          match.text
        )
      )
    }

    return name
  }

  renderDate() {
    const {date, isFocused} = this.props
    if (!date) return null
    const {classes} = this.props.sheet
    return (
      <span className={isFocused ? classes.metaItemFocused : classes.metaItem}>
        {moment(date).format('ddd, MMM D YYYY, h:mm a')}
      </span>
    )
  }

  renderState() {
    const state = utils.getLabel(this.props.detail)
    if (!state) return null
    const {classes} = this.props.sheet
    const className = this.props.isFocused ? classes.metaItemFocused : classes.metaItem
    return <span className={className}>{state}</span>
  }

  render() {
    const {classes} = this.props.sheet
    const {isFocused, service, info} = this.props
    let containerClassName = isFocused ? classes.containerFocused : classes.container
    if (!this.props.isViewFocused && isFocused) {
      containerClassName = classes.containerFocusedInactive
    }
    const infoClassName = isFocused ? classes.infoFocused : classes.info

    return (
      <div
        onClick={this.onClick}
        className={containerClassName}>
        <div className={classes.iconContainer}>
          <ServiceIcon service={service} />
        </div>
        <div className={classes.nameContainer}>
          <div className={classes.name}>
            {this.renderName()}
          </div>
          <div className={infoClassName}>{info}</div>
        </div>
        <div className={classes.metaContainer}>
          {this.renderDate()}
          {this.renderState()}
        </div>
      </div>
    )
  }
}
