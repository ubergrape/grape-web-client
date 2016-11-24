import React, {PropTypes, PureComponent} from 'react'
import {NotificationStack} from 'react-notification'

import {jss} from 'grape-web/lib/jss'
import {styles, verticalSpacing} from './theme'

const jssCompile = (rule) => jss.createRule(rule).toJSON()

const activeBarStyleFactory = (index, style) => ({
  ...style,
  top: styles.bar.top + index * (styles.bar.height + verticalSpacing),
  zIndex: 1
})

const barStyleFactory = (index, style) => style

const styleNotification = (notification) => {
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

export default class ToastNotification extends PureComponent {
  static defaultProps = {
    dismissAfter: 3000
  }

  static propTypes = {
    dismissAfter: PropTypes.number.isRequired,
    notifications: PropTypes.array.isRequired,
    onDismiss: PropTypes.func
  }

  onDismiss = (notification) => {
    this.props.onDismiss({key: notification.key})
  }

  render() {
    const {
      dismissAfter,
      notifications
    } = this.props

    return (
      <NotificationStack
        notifications={notifications.map(styleNotification)}
        dismissAfter={dismissAfter}
        onDismiss={this.onDismiss}
        activeBarStyleFactory={activeBarStyleFactory}
        barStyleFactory={barStyleFactory} />
    )
  }
}
