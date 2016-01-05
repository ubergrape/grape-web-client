import React, {Component, PropTypes} from 'react'

import Alert from '../alert/Alert'
import TextAlert from '../text-alert/TextAlert'
import NotificationsAlert from '../notifications-alert/NotificationsAlert'
import ConnectionLostAlert from '../connection-lost-alert/ConnectionLostAlert'

import * as types from '../constants/alerts'

import {useSheet} from 'grape-web/lib/jss'
import style from './style'

@useSheet(style)
export default class AlertPicker extends Component {
  static propTypes = {
    sheet: PropTypes.object.isRequired,
    alerts: PropTypes.array,
    enableNotifications: PropTypes.func,
    hideAlert: PropTypes.func,
    clearAlertDelay: PropTypes.func
  }

  constructor(props) {
    super(props)
    this.timeoutIds = []
  }

  componentWillUnmount() {
    this.timeoutIds.forEach(clearTimeout)
  }

  renderAlertContent(alert) {
    switch (alert.type) {
      case types.NOTIFICATIONS_REMINDER:
        return (
          <NotificationsAlert
            alert={alert}
            enableNotifications={this.props.enableNotifications}
            hideAlert={this.props.hideAlert} />
        )
      case types.CONNECTION_LOST:
        return <ConnectionLostAlert />
      case types.LOADING_HISTORY:
      case types.RECONNECTED:
      case types.URL_NOT_FOUND:
      case types.MESSAGE_NOT_FOUND:
      case types.MESSAGE_TO_SELF:
      default:
        return <TextAlert type={alert.type} />
    }
  }

  render() {
    const {alerts, hideAlert} = this.props
    if (!alerts.length) return false

    const {classes} = this.props.sheet
    return (
      <ul
        className={classes.alerts}>
        {alerts.map((alert, i) => {
          return (
            <li
              className={`${classes.alert} ${classes[alert.level]}`}
              key={i}>
              <Alert
                key={i}
                closeAfter={alert.closeAfter}
                onCloseAfter={hideAlert.bind(null, alert)}>
                {this.renderAlertContent(alert)}
              </Alert>
            </li>
          )
        })}
      </ul>
    )
  }
}
