import React, {Component} from 'react'
import useSheet from 'react-jss'
import {shouldPureComponentUpdate} from 'react-pure-render'

import style from './style'

/**
 * Display information when grid is empty
 */
@useSheet(style)
export default class Empty extends Component {
  static defaultProps = {
    text: ''
  }

  shouldComponentUpdate = shouldPureComponentUpdate

  render() {
    let {classes} = this.props.sheet
    return (
      <div className={classes.container}>
        <div className={classes.info}>{this.props.text}</div>
      </div>
    )
  }
}
