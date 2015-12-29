import React, {Component, PropTypes} from 'react'

import Alert from '../alert/Alert'

import * as types from '../constants/alerts'
import alertText from './alertText'

import {useSheet} from 'grape-web/lib/jss'
import style from './style'

@useSheet(style)
export default class Alerts extends Component {
  static propTypes = {
    sheet: PropTypes.object.isRequired,
    alerts: PropTypes.array,
    enableNotifications: PropTypes.func,
    hideAlert: PropTypes.func,
    clearAlertDelay: PropTypes.func
  }

  componentWillUnmount() {
    if (this.delays) this.delays.forEach(clearTimeout)
  }

  onEnableNotifications(alert) {
    this.props.enableNotifications()
    this.props.hideAlert(alert)
  }

  onReload() {
    window.location.reload()
  }

  delayAlert(alert) {
    if (!this.delays) this.delays = []
    this.delays.push(
      setTimeout(this.props.clearAlertDelay.bind(null, alert), alert.delay)
    )
  }

  renderNotificationsReminder(alert) {
    const {hideAlert} = this.props
    const {classes} = this.props.sheet
    const onEnableNotifications = this.onEnableNotifications.bind(this, alert)
    return (
      <span
        className={classes.layout}>
        <span
          className={classes.mainCol}>
          Hey there!
          {' '}
          <button
            className={classes.buttonLink}
            onClick={onEnableNotifications}>
            Please enable desktop notifications
          </button>
          {' '}
          so your team members can reach you on ChatGrape.
        </span>
        <span
          className={classes.secondaryCol}>
          <button
            className={`${classes.actionButton} ${classes[alert.level + 'Button']}`}
            onClick={onEnableNotifications}>
            Enable notifications
          </button>
        </span>
        <span
          className={classes.secondary}>
          <button
            className={classes.buttonLink}
            onClick={hideAlert.bind(null, alert)}>
            close
          </button>
        </span>
      </span>
    )
  }

  renderConnetionLost() {
    const {classes} = this.props.sheet
    return (
      <span>
        Lost connection to the server — trying to reconnect. You can also try to
        {' '}
        <button
          className={classes.buttonLink}
          onClick={::this.onReload}>
          reload
        </button>
        .
      </span>
    )
  }

  renderAlertContent(alert) {
    switch (alert.type) {
      case types.NOTIFICATIONS_REMINDER:
        return this.renderNotificationsReminder(alert)
      case types.CONNECTION_LOST:
        return this.renderConnetionLost()
      case types.LOADING_HISTORY:
      case types.RECONNECTED:
      case types.URL_NOT_FOUND:
      case types.MESSAGE_NOT_FOUND:
      case types.MESSAGE_TO_SELF:
        return alertText(alert.type)
      default:
        return ''
    }
  }

  renderAlerts() {
    const {alerts, hideAlert} = this.props
    if (!alerts.length) return false

    const {classes} = this.props.sheet
    return (
      <ul
        className={classes.list}>
        {alerts.map((alert, i) => {
          if (alert.delay) {
            this.delayAlert(alert)
            return false
          }
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

  render() {
    return (
      <div
        className={this.props.sheet.classes.alerts}>
        {this.renderAlerts()}
      </div>
    )
  }
}
