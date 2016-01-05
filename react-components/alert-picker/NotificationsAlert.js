import React, {Component, PropTypes} from 'react'

import {useSheet} from 'grape-web/lib/jss'
import style from './alertStyle'

@useSheet(style)
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
          {'Hey there! '}
          <button
            className={classes.buttonLink}
            onClick={onEnableNotifications}>
            Please enable desktop notifications
          </button>
          {' so your team members can reach you on ChatGrape.'}
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
            onClick={this.props.hideAlert.bind(null, alert)}>
            close
          </button>
        </span>
      </span>
    )
  }
}
