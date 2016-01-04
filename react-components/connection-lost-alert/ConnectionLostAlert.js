import React, {Component, PropTypes} from 'react'

import {useSheet} from 'grape-web/lib/jss'
import style from './style'

@useSheet(style)
export default class ConnectionLostAlert extends Component {
  static propTypes = {
    sheet: PropTypes.object.isRequired
  }

  onReload() {
    window.location.reload()
  }

  render() {
    const {classes} = this.props.sheet
    return (
      <span>
        {'Lost connection to the server — trying to reconnect. You can also try to '}
        <button
          className={classes.buttonLink}
          onClick={this.onReload}>
          reload
        </button>
        .
      </span>
    )
  }
}
