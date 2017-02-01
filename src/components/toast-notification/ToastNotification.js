import React, {PropTypes, PureComponent} from 'react'
import {NotificationStack} from '@ubergrape/react-notification'
import injectSheet, {inlineStyle} from 'grape-web/lib/jss'
import cn from 'classnames'

import {styles, transitionDuration} from './theme'

const activeBarStyleFactory = (index, style) => ({
  ...style,
  zIndex: 1
})

const barStyleFactory = (index, style) => style

const styleNotification = (notification) => {
  const {activeBar, bar} = styles

  return {
    ...notification,
    activeBarStyle: inlineStyle(activeBar),
    barStyle: inlineStyle(bar)
  }
}

@injectSheet(styles)
export default class ToastNotification extends PureComponent {
  static defaultProps = {
    dismissAfter: 3000
  }

  static propTypes = {
    dismissAfter: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string
    ]).isRequired,
    notifications: PropTypes.array.isRequired,
    onDismiss: PropTypes.func.isRequired,
    sheet: PropTypes.object.isRequired,
    sidebar: PropTypes.oneOfType([
      PropTypes.bool,
      PropTypes.string
    ]).isRequired
  }

  onDismiss = (notification) => {
    setTimeout(() => {
      this.props.onDismiss({key: notification.key})
    }, transitionDuration)
  }

  styleNotifications = () => this.props.notifications.map(styleNotification)

  render() {
    const {
      sheet: {classes},
      dismissAfter,
      sidebar
    } = this.props

    return (
      <div className={cn(classes.container, sidebar && classes.hasSidebar)}>
        <NotificationStack
          notifications={this.styleNotifications()}
          dismissAfter={dismissAfter}
          onDismiss={this.onDismiss}
          activeBarStyleFactory={activeBarStyleFactory}
          barStyleFactory={barStyleFactory}
        />
      </div>
    )
  }
}
