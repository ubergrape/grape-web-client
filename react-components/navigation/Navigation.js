import React, {Component, PropTypes} from 'react'
import {useSheet} from 'grape-web/lib/jss'

import style from './style'

@useSheet(style)
export default class Navigation extends Component {
  static propTypes = {
    sheet: PropTypes.object.isRequired
  }
  render() {
    const {classes} = this.props.sheet

    return (
      <div className={classes.navigation}>
        Fuck yeah
      </div>
    )
  }
}
