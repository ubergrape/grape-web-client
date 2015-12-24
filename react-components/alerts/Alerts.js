import React, {Component, PropTypes} from 'react'

import Alert from '../alert/Alert'

import {useSheet} from 'grape-web/lib/jss'
import style from './style'

@useSheet(style)
export default class Alerts extends Component {
  static propTypes = {

  }

  static defaultProps = {

  }

  renderAlert(alert, i) {
    return (
      <li key={i}>
        <Alert
          alert={alert}
          key={i}
          {...this.props} />
      </li>
    )
  }

  renderAlerts() {
    const {alerts} = this.props
    if (!alerts.length) return

    return (
      <ul>{alerts.map((alert, i) => this.renderAlert(alert,i))}</ul>
    )
  }

  render() {
    console.log(this.props)
    return (
      <div>{this.renderAlerts()}</div>
    )
  }
}
