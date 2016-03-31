import React, {Component, PropTypes} from 'react'
import noop from 'lodash/utility/noop'
import moment from 'moment'

import {useSheet} from 'grape-web/lib/jss'
import findMatches from 'grape-web/lib/search/findMatches'
import * as style from './style'
import * as utils from './utils'
import ServiceIcon from '../service-icon/ServiceIcon'

/**
 * One result.
 */
@useSheet(style.rules)
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

  onClick() {
    if (this.props.isFocused) this.props.onSelect()
    else this.props.onFocus()
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
    const {isFocused, service, info} = this.props
    let containerClassName = isFocused ? classes.containerFocused : classes.container
    if (!this.props.isViewFocused && isFocused) {
      containerClassName = classes.containerFocusedInactive
    }
    const metaItemClassName = isFocused ? classes.metaItemFocused : classes.metaItem
    const state = utils.getLabel(this.props.detail)

    return (
      <div
        onClick={::this.onClick}
        className={containerClassName}>
        <div className={classes.iconContainer}>
          <ServiceIcon service={service} />
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
    )
  }
}
