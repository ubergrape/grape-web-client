import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { NotificationStack } from 'react-notification'
import injectSheet, { inlineStyle } from 'grape-web/lib/jss'
import cn from 'classnames'
import { normal } from 'grape-theme/dist/fonts'
import { white, indigo } from 'grape-theme/dist/base-colors'
import { borderRadius, screenWidth } from 'grape-theme/dist/sizes'
import { translateZ, translateX } from 'css-functions'

import { zIndex } from '../../utils/z-index'
import { height as headerHeight } from '../header'
import { sidebarWidth, sidebarWidthXl } from '../app-layout'
import { transitionDuration } from './constants'

const spacing = 10

const width = 275

const styles = {
  container: {
    position: 'absolute',
    right: 0,
    top: headerHeight,
    width,
    zIndex: zIndex('toast'),
  },
  // We don't want notification to cover sidebar.
  hasSidebar: {
    right: sidebarWidthXl,
    [`@media (max-width: ${screenWidth.xl}px)`]: {
      right: sidebarWidth,
    },
  },
  bar: {
    position: 'relative',
    top: 'auto',
    bottom: 'auto',
    left: 'auto',
    right: 0,
    padding: spacing * 2,
    margin: {
      top: spacing,
      left: spacing,
    },
    boxShadow: 'none',
    color: white,
    fontSize: normal.fontSize,
    fontFamily: 'inherit',
    lineHeight: 1,
    textAlign: 'center',
    borderRadius: borderRadius.bigger,
    background: indigo,
    transition: [
      {
        property: 'transform',
        duration: `${transitionDuration}ms`,
        timingFunction: 'cubic-bezier(0.89, 0.01, 0.5, 1.1)',
      },
      {
        property: 'opacity',
        duration: `${transitionDuration}ms`,
      },
    ],
    transform: [translateZ(0), translateX(width)],
    opacity: 0,
  },
  activeBar: {
    transform: translateX(-spacing * 2),
    marginLeft: 'auto',
    opacity: 1,
  },
}

const activeBarStyleFactory = (index, style) => ({
  ...style,
  zIndex: 1,
})

const barStyleFactory = (index, style) => style

const styleNotification = notification => {
  const { activeBar, bar } = styles

  return {
    ...notification,
    activeBarStyle: inlineStyle(activeBar),
    barStyle: inlineStyle(bar),
  }
}

@injectSheet(styles)
export default class ToastNotification extends PureComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    dismissAfter: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    notifications: PropTypes.array.isRequired,
    onDismiss: PropTypes.func.isRequired,
    sidebar: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]).isRequired,
  }

  static defaultProps = {
    dismissAfter: 3000,
  }

  onDismiss = notification => {
    setTimeout(() => {
      this.props.onDismiss({ key: notification.key })
    }, transitionDuration)
  }

  styleNotifications = () => this.props.notifications.map(styleNotification)

  render() {
    const { classes, dismissAfter, sidebar } = this.props

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
