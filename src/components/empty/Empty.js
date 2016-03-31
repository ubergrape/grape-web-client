import React, {Component, PropTypes} from 'react'
import {shouldPureComponentUpdate} from 'react-pure-render'

import {useSheet} from 'grape-web/lib/jss'
import style from './style'

/**
 * Display information when missing results.
 */
@useSheet(style)
export default class Empty extends Component {
  static propTypes = {
    text: PropTypes.string,
    sheet: PropTypes.object.isRequired
  }

  static defaultProps = {
    text: ''
  }

  shouldComponentUpdate = shouldPureComponentUpdate

  render() {
    const {classes} = this.props.sheet
    return (
      <div className={classes.container} data-test="empty">
        <div className={classes.info}>{this.props.text}</div>
      </div>
    )
  }
}
