import React, {Component, PropTypes} from 'react'

import {useSheet} from 'grape-web/lib/jss'
import style from './style'

@useSheet(style)
export default class Alert extends Component {
  static propTypes = {
    sheet: PropTypes.object.isRequired,
    alert: PropTypes.object.isRequired,
    hideAlert: PropTypes.func.isRequired,
    enableNotifications: PropTypes.func.isRequired,
    timer: PropTypes.number
  }

  static defaultProps = {

  }

  componentWillUnmount() {
    if (this.timer) clearTimeout(this.timer)
  }

  onReload() {
    window.location.reload()
  }

  onEnableNotifications(alert) {
    this.props.enableNotifications()
    this.props.hideAlert(alert)
  }

  renderNotificationsReminder() {
    const {alert, hideAlert} = this.props
    const {classes} = this.props.sheet
    const onEnableNotifications = this.onEnableNotifications.bind(this, alert)
    return (
      <span
        className={classes.layout}>
        <span
          className={classes.main}>
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
          className={classes.secondary}>
          <button
            className={`${classes.actionButton} ${classes[alert.level]}`}
            onClick={onEnableNotifications}>
            Enable notifications
          </button>
        </span>
        <span
          className={classes.secondary}>
          <button
            className={classes.buttonLink}
            onClick={hideAlert.bind(this, alert)}>
            close
          </button>
        </span>
      </span>
    )
  }

  renderConnetionLost() {
    return (
      <span>
        Lost connection to the server - trying to reconnect. You can also try to
        <button
          onClick={::this.onReload}>
          reload
        </button>
      </span>
    )
  }

  renderReconnected() {
    return <span>Reconnected successfully</span>
  }

  renderUrlNotFound() {
    return (
      <span>
        We could not find what you were looking for&nbsp;-
        the room might have been deleted, renamed or moved.
      </span>
    )
  }

  renderMessageNotFound() {
    return (
      <span>
        We could not find the message you were looking for.
      </span>
    )
  }

  renderMessageToSelf() {
    return (
      <span>You cannot message yourself.</span>
    )
  }

  renderLoadingHistory() {
    return (
      <span>Loading your chat history&middot;</span>
    )
  }

  render() {

    const {alert} = this.props
    if (alert.closeAfter) {
      this.timer = setTimeout(() => {
        this.props.hideAlert(alert)
      }, alert.closeAfter)
    }

    switch (alert.type) {
      case 'notifications reminder':
        return this.renderNotificationsReminder()
      case 'connection lost':
        return this.renderConnetionLost()
      case 'reconnected':
        return this.renderReconnected()
      case 'url not found':
        return this.renderUrlNotFound()
      case 'message not found':
        return this.renderMessageNotFound()
      case 'message to self':
        return this.renderMessageToSelf()
      case 'loading history':
        return this.renderLoadingHistory()
      default:
        return <span></span>
    }
  }
}
