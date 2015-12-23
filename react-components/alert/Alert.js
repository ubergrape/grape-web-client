import React, {Component, PropTypes} from 'react'

import {useSheet} from 'grape-web/lib/jss'
import style from './style'

@useSheet(style)
export default class Alert extends Component {
  static propTypes = {

  }

  static defaultProps = {

  }

  componentDidMount() {
    const {alert} = this.props
    if (alert.closeAfter) {
      this.closeAfter = setTimeout(() => {
        this.props.hideAlert(alert)
      }, alert.closeAfter)
    }
  }

  componentWillUnmount() {
    if (this.closeAfter) clearTimeout(this.closeAfter)
  }

  onReload() {
    window.location.reload()
  }

  onEnableNotifications(alert) {
    this.props.enableNotifications()
    this.props.hideAlert(alert)
  }

  renderNotificationsReminder() {
    const {alert, key, hideAlert} = this.props
    const onEnableNotifications = this.onEnableNotifications.bind(this, alert)
    return (
      <span key={key}>
        Hey there!
        <button
          onClick={onEnableNotifications}>
          Please enable desktop notifications
        </button>
        , so your team members can reach you on ChatGrape.
        <button
          onClick={onEnableNotifications}>
          Enable notifications
        </button>
        <button onClick={hideAlert.bind(this, alert)}>x</button>
      </span>
    )

  }

  renderConnetionLost() {
    const {alert, key} = this.props
    return (
      <span key={key}>
        Lost connection to the server - trying to reconnect. You can also try to
        <button
          onClick={::this.onReload}>
          reload
        </button>
      </span>
    )
  }

  renderReconnected() {
    return <span key={this.props.key}>Reconnected successfully</span>
  }

  render() {
    switch (this.props.alert.type) {
      case 'notifications reminder':
        return this.renderNotificationsReminder()
      case 'connection lost':
        return this.renderConnetionLost()
      case 'reconnected':
        return this.renderReconnected()
      default:
        return <span key={this.props.key}></span>
    }
  }
}
