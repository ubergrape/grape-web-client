import React, {Component, PropTypes} from 'react'

import {useSheet} from 'grape-web/lib/jss'
import style from './style'

@useSheet(style)
export default class Alert extends Component {
  static propTypes = {

  }

  static defaultProps = {

  }

  onEnableNotifications(alert) {
    this.props.enableNotifications()
    this.props.hideAlert(alert)
  }

  render() {
    const {alert, key, hideAlert} = this.props

    switch (alert.type) {
      case 'notifications reminder':
        const onEnableNotifications = this.onEnableNotifications.bind(this, alert)
        return (
          <span key={key}>
            Hey there!
            <button
              onClick={onEnableNotifications}>
              Please enable desktop notifications
            </button>
            , so your team members can reach you on ChatGrape.'
            <button
              onClick={onEnableNotifications}>
              Enable notifications
            </button>
            <button onClick={hideAlert.bind(this, alert)}>x</button>
          </span>
        )
      default:
        return ''
    }
  }
}
