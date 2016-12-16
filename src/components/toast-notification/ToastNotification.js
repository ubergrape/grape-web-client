import React, {PropTypes, PureComponent} from 'react'
import {NotificationStack} from 'react-notification'

import injectSheet, {inlineStyle} from 'grape-web/lib/jss'
import {styles, transitionDuration} from './theme'

const activeBarStyleFactory = (index, style) => ({
  ...style,
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
    activeBarStyle: inlineStyle(activeBarStyle),
    barStyle: inlineStyle(barStyle)
  }
}

@injectSheet(styles)
export default class ToastNotification extends PureComponent {
  static defaultProps = {
    dismissAfter: 3000
  }

  static propTypes = {
    dismissAfter: PropTypes.number.isRequired,
    notifications: PropTypes.array.isRequired,
    onDismiss: PropTypes.func,
    sheet: PropTypes.object.isRequired
  }

  onDismiss = (notification) => {
    setTimeout(() => {
      this.props.onDismiss({key: notification.key})
    }, transitionDuration)
  }

  render() {
    const {
      dismissAfter,
      notifications,
      sheet: {classes}
    } = this.props

    return (
      <div className={classes.container}>
        <NotificationStack
          notifications={notifications.map(styleNotification)}
          dismissAfter={dismissAfter}
          onDismiss={this.onDismiss}
          activeBarStyleFactory={activeBarStyleFactory}
          barStyleFactory={barStyleFactory} />
      </div>
    )
  }
}
