import React, {Component, PropTypes} from 'react'

import Alert from '../alert/Alert'

import {useSheet} from 'grape-web/lib/jss'
import style from './style'

@useSheet(style)
export default class Alerts extends Component {
  static propTypes = {
    sheet: PropTypes.object.isRequired,
    alerts: PropTypes.array
  }

  renderAlert(alert, i) {
    const {classes} = this.props.sheet
    return (
      <li
        className={`${classes.alert} ${classes[alert.level]}`}
        key={i}>
        <Alert
          alert={alert}
          key={i}
          {...this.props} />
      </li>
    )
  }

  renderAlerts() {
    const {alerts} = this.props
    if (!alerts.length) return false

    return (
      <ul
        className={this.props.sheet.classes.list}>
        {alerts.map((alert, i) => this.renderAlert(alert, i))}
      </ul>
    )
  }

  render() {
    return (
      <div
        className={this.props.sheet.classes.alerts}>
        {this.renderAlerts()}
      </div>
    )
  }
}
