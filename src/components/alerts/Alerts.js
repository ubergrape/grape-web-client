import PropTypes from 'prop-types'
import React, {PureComponent} from 'react'
import injectSheet from 'grape-web/lib/jss'
import noop from 'lodash/utility/noop'

import * as types from '../../constants/alerts'
import Alert from './Alert'
import TextAlert from './TextAlert'
import NotificationsAlert from './NotificationsAlert'
import ConnectionLostAlert from './ConnectionLostAlert'
import style from './alertsStyle'

@injectSheet(style)
export default class Alerts extends PureComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    alerts: PropTypes.array,
    enableNotifications: PropTypes.func,
    hideAlert: PropTypes.func
  }

  static defaultProps = {
    hideAlert: noop,
    enableNotifications: noop,
    alerts: []
  }

  renderAlertContent(alert) {
    switch (alert.type) {
      case types.NOTIFICATIONS_REMINDER:
        return (
          <NotificationsAlert
            alert={alert}
            enableNotifications={this.props.enableNotifications}
            hideAlert={this.props.hideAlert}
          />
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
    const {alerts, hideAlert, classes} = this.props

    if (!alerts.length) return false

    return (
      <div className={classes.alerts}>
        {alerts.map(alert => (
          <div className={`${classes.alert} ${classes[alert.level]}`} key={alert.type}>
            <Alert
              data={alert}
              closeAfter={alert.closeAfter}
              onCloseAfter={hideAlert}
            >
              {this.renderAlertContent(alert)}
            </Alert>
          </div>
        ))}
      </div>
    )
  }
}
