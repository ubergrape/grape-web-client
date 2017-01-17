import React, {PureComponent, PropTypes} from 'react'

import Alert from './Alert'
import TextAlert from './TextAlert'
import NotificationsAlert from './NotificationsAlert'
import ConnectionLostAlert from './ConnectionLostAlert'

import * as types from '../../constants/alerts'

import injectSheet from 'grape-web/lib/jss'
import style from './alertsStyle'

@injectSheet(style)
export default class Alerts extends PureComponent {
  static propTypes = {
    sheet: PropTypes.object.isRequired,
    alerts: PropTypes.array,
    enableNotifications: PropTypes.func,
    hideAlert: PropTypes.func,
    clearAlertDelay: PropTypes.func
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
    const {alerts, hideAlert, sheet: {classes}} = this.props

    if (!alerts.length) return false

    return (
      <ul className={classes.alerts}>
        {alerts.map((alert, i) => (
          <li
            className={`${classes.alert} ${classes[alert.level]}`}
            key={i}>
            <Alert
              key={i}
              closeAfter={alert.closeAfter}
              onCloseAfter={/* TODO #120 */hideAlert.bind(null, alert)}>
              {this.renderAlertContent(alert)}
            </Alert>
          </li>
        ))}
      </ul>
    )
  }
}
