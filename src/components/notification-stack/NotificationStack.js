import React, {PropTypes, PureComponent} from 'react'
import {NotificationStack as ReactNotificationStack} from 'react-notification'

import {jss} from 'grape-web/lib/jss'
import {styles} from './theme'

const jssCompile = rule => jss.createRule(rule).toJSON()

export default class NotificationStack extends PureComponent {
  static propTypes = {
    dismissAfter: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.bool
    ]),
    notifications: PropTypes.array.isRequired,
    onDismiss: PropTypes.func
  }

  activeBarStyleFactory(index, style) {
    return {
      ...style,
      top: `${2 + index * 4}rem`
    }
  }

  barStyleFactory(index, style) {
    return style
  }

  styleNotification(notification) {
    const {
      activeBar: activeBarStyle,
      bar: barStyle
    } = styles

    return {
      ...notification,
      activeBarStyle: jssCompile(activeBarStyle),
      barStyle: jssCompile(barStyle)
    }
  }

  onDismiss = (notification) => {
    this.props.onDismiss(notification.key)
  }

  render() {
    const {
      dismissAfter = 3000,
      notifications
    } = this.props

    return (
      <ReactNotificationStack
        notifications={notifications.map(this.styleNotification)}
        dismissAfter={dismissAfter}
        onDismiss={this.onDismiss}
        activeBarStyleFactory={this.activeBarStyleFactory}
        barStyleFactory={this.barStyleFactory} />
    )
  }
}
