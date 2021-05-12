import PropTypes from 'prop-types'
import React, { Component, createElement } from 'react'
import noop from 'lodash/noop'
import moment from 'moment'

import injectSheet from 'grape-web/lib/jss'
import findMatches from 'grape-web/lib/search/findMatches'
import * as style from './style'
import * as utils from './utils'
import ServiceIcon from '../service-icon/ServiceIcon'

/**
 * One result.
 */
class Result extends Component {
  static propTypes = {
    sheet: PropTypes.object.isRequired,
    data: PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
      info: PropTypes.string,
      detail: PropTypes.object,
      date: PropTypes.string,
      service: PropTypes.string,
    }),
    isFocused: PropTypes.bool,
    isViewFocused: PropTypes.bool,
    search: PropTypes.string,
    onFocus: PropTypes.func,
    onSelect: PropTypes.func,
  }

  static defaultProps = {
    isFocused: false,
    isViewFocused: false,
    search: '',
    onFocus: noop,
    onSelect: noop,
    data: {},
  }

  onClick = () => {
    const { isFocused, onSelect, onFocus, data } = this.props
    if (isFocused) onSelect(data)
    else onFocus(data)
  }

  renderName() {
    let { name } = this.props.data
    const matches = findMatches(name, this.props.search)

    if (matches.length) {
      name = matches.map((match, i) =>
        createElement(match.found ? 'b' : 'span', { key: i }, match.text),
      )
    }

    return name
  }

  renderDate() {
    const {
      data: { date },
      isFocused,
    } = this.props
    if (!date) return null
    const { classes } = this.props.sheet
    return (
      <span className={isFocused ? classes.metaItemFocused : classes.metaItem}>
        {moment(date).format('ddd, MMM D YYYY, h:mm a')}
      </span>
    )
  }

  renderState() {
    const state = utils.getLabel(this.props.data.detail)
    if (!state) return null
    const { classes } = this.props.sheet
    const className = this.props.isFocused
      ? classes.metaItemFocused
      : classes.metaItem
    return <span className={className}>{state}</span>
  }

  render() {
    const { classes } = this.props.sheet
    const {
      isFocused,
      data: { info, service },
    } = this.props
    let containerClassName = isFocused
      ? classes.containerFocused
      : classes.container
    if (!this.props.isViewFocused && isFocused) {
      containerClassName = classes.containerFocusedInactive
    }
    const infoClassName = isFocused ? classes.infoFocused : classes.info

    return (
      <div onClick={this.onClick} className={containerClassName}>
        <div className={classes.iconContainer}>
          <ServiceIcon service={service} />
        </div>
        <div className={classes.nameContainer}>
          <div className={classes.name}>{this.renderName()}</div>
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

export default injectSheet(style.rules)(Result)
