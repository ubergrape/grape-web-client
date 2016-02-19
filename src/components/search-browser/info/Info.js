import React, {Component, PropTypes} from 'react'
import noop from 'lodash/utility/noop'
import {useSheet} from 'grape-web/lib/jss'

import style from './style'

/**
 * Info messages for the user for e.g. to explain integrations.
 */
@useSheet(style)
export default class Info extends Component {
  static propTypes = {
    sheet: PropTypes.object,
    onAddIntegration: PropTypes.func
  }

  static defaultProps = {
    onAddIntegration: noop
  }

  onAddIntegration(e) {
    e.preventDefault()
    this.props.onAddIntegration()
  }

  render() {
    const {classes} = this.props.sheet

    return (
      <div className={classes.info}>
        <span>Search Wikipedia, Youtube, Giphy and </span>
        <a href="" onClick={::this.onAddIntegration}>your business tools</a>
        <span> by clicking </span>
        <i className={classes.plusIcon}></i>
        <span> or pressing the plus key.</span>
      </div>
    )
  }
}
