import React, {Component, PropTypes} from 'react'
import {FormattedMessage} from 'react-intl'
import injectSheet from 'grape-web/lib/jss'

import {CloseLower as Close} from '../i18n/i18n'
import style from './alertStyle'

@injectSheet(style)
export default class NotificationsAlert extends Component {
  static propTypes = {
    sheet: PropTypes.object.isRequired,
    alert: PropTypes.object.isRequired,
    enableNotifications: PropTypes.func,
    hideAlert: PropTypes.func
  }

  onEnableNotifications(alert) {
    this.props.enableNotifications()
    this.props.hideAlert(alert)
  }

  render() {
    const {alert} = this.props
    const {classes} = this.props.sheet
    const onEnableNotifications = this.onEnableNotifications.bind(this, alert)
    return (
      <span
        className={classes.layout}>
        <span
          className={classes.mainCol}>
          <FormattedMessage
            id="initialGreeting"
            defaultMessage="Hey there!" />
          {' '}
          <button
            className={classes.buttonLink}
            onClick={onEnableNotifications}>
            <FormattedMessage
              id="enableNotificationsRequest"
              defaultMessage="Please enable desktop notifications" />
          </button>
          {' '}
          <FormattedMessage
            id="notificationsExplanation"
            defaultMessage="so your team members can reach you on Grape." />
        </span>
        <span
          className={classes.secondaryCol}>
          <button
            className={`${classes.actionButton} ${classes[alert.level + 'Button']}`}
            onClick={onEnableNotifications}>
            <FormattedMessage
              id="enableNotifications"
              defaultMessage="Enable notifications" />
          </button>
        </span>
        <span
          className={classes.secondaryCol}>
          <button
            className={classes.buttonLink}
            onClick={this.props.hideAlert.bind(null, alert)}>
              <Close />
          </button>
        </span>
      </span>
    )
  }
}
