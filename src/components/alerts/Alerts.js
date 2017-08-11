import PropTypes from 'prop-types'
import React, {PureComponent} from 'react'
import injectSheet from 'grape-web/lib/jss'
import noop from 'lodash/utility/noop'
import fonts from 'grape-theme/dist/fonts'
import webColors from 'grape-theme/dist/web-colors'
import {white} from 'grape-theme/dist/base-colors'
import cn from 'classnames'

import * as types from '../../constants/alerts'
import {zIndex} from '../../utils/z-index'
import AutoHide from './AutoHide'
import TextAlert from './TextAlert'
import NotificationsAlert from './NotificationsAlert'

@injectSheet({
  alerts: {
    extend: fonts.small,
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    zIndex: zIndex('alerts')
  },
  alertContainer: {
    padding: [10, 10, 10, 20],
    borderBottom: [1, 'solid'],
    opacity: 1,
    transform: 'scaleX(1) translate3d(0, 0, 0)',
    animation: 'hifromthetopNoShadow 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    color: white,
    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.2)'
  },
  info: {
    background: webColors.alertInfo
  },
  success: {
    background: webColors.alertSuccess
  },
  warning: {
    background: webColors.alertWarning
  },
  danger: {
    background: webColors.alertDanger
  }
})
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

  renderAlert(alert) {
    switch (alert.type) {
      case types.NOTIFICATIONS_REMINDER:
        return (
          <NotificationsAlert
            alert={alert}
            enableNotifications={this.props.enableNotifications}
            hideAlert={this.props.hideAlert}
          />
        )
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
          <div className={cn(classes.alertContainer, classes[alert.level])} key={alert.type}>
            <AutoHide
              data={alert}
              delay={alert.closeAfter}
              onHide={hideAlert}
            >
              {this.renderAlert(alert)}
            </AutoHide>
          </div>
        ))}
      </div>
    )
  }
}
