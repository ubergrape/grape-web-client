import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import injectSheet from 'grape-web/lib/jss'
import Icon from 'grape-web/lib/svg-icons/Icon'
import noop from 'lodash/noop'
import fonts from 'grape-theme/dist/fonts'
import webColors from 'grape-theme/dist/web-colors'
import {
  white,
  green,
  indigo,
  blue,
  yellow,
} from 'grape-theme/dist/base-colors'
import cn from 'classnames'
import IconButton from 'grape-web/lib/components/icon-button'

import * as types from '../../constants/alerts'
import AutoHide from './AutoHide'
import TextAlert from './TextAlert'
import NotificationsAlert from './NotificationsAlert'
import ReconnectionAlert from './ReconnectionAlert'

@injectSheet({
  alert: {
    display: 'block',
    font: 'inherit',
  },
  body: {
    font: 'inherit',
    display: 'flex',
  },
  content: {
    padding: 10,
    color: white,
    font: 'inherit',
    flexGrow: 1,
  },
  close: {
    isolate: false,
    extend: fonts.normal,
    color: white,
    width: 40,
    height: 40,
    opacity: 0.8,
    '&:hover': {
      isolate: false,
      opacity: 1,
    },
  },
  infoContainer: {
    background: webColors.alertInfo,
  },
  successContainer: {
    background: webColors.alertSuccess,
  },
  warningContainer: {
    background: webColors.alertWarning,
  },
  dangerContainer: {
    background: webColors.alertDanger,
  },
  button: {
    font: 'inherit',
    padding: 0,
    minHeight: 0,
    '&:hover': {
      isolate: false,
      background: 'none',
      textDecoration: 'underline',
    },
  },
  infoButton: {
    composes: '$button',
    color: green,
  },
  successButton: {
    composes: '$button',
    color: indigo,
  },
  warningButton: {
    composes: '$button',
    color: blue,
  },
  dangerButton: {
    composes: '$button',
    color: yellow,
  },
})
export default class Alert extends PureComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    reconnect: PropTypes.object.isRequired,
    alert: PropTypes.shape({
      type: PropTypes.string.isRequired,
      level: PropTypes.oneOf(['info', 'success', 'warning', 'danger'])
        .isRequired,
      closeAfter: PropTypes.number,
      isClosable: PropTypes.bool,
    }).isRequired,
    onHide: PropTypes.func,
    enableNotifications: PropTypes.func,
    onReconnect: PropTypes.func,
    updateReconnectTimer: PropTypes.func,
  }

  static defaultProps = {
    onHide: noop,
    enableNotifications: noop,
    onReconnect: noop,
    updateReconnectTimer: noop,
  }

  onHide = () => {
    const { onHide, alert } = this.props
    onHide(alert)
  }

  renderContent(alert) {
    const {
      classes,
      enableNotifications,
      onReconnect,
      updateReconnectTimer,
      reconnect,
    } = this.props
    switch (alert.type) {
      case types.NOTIFICATIONS_REMINDER:
        return (
          <NotificationsAlert
            alert={alert}
            onEnableNotifications={enableNotifications}
            onHide={this.onHide}
            buttonClass={classes[`${alert.level}Button`]}
          />
        )
      case types.CONNECTION_LOST: {
        return (
          <ReconnectionAlert
            onReconnect={onReconnect}
            updateReconnectTimer={updateReconnectTimer}
            reconnect={reconnect}
            buttonClass={classes[`${alert.level}Button`]}
          />
        )
      }
      default:
        return <TextAlert type={alert.type} />
    }
  }

  render() {
    const { classes, alert, onHide } = this.props

    return (
      <div
        className={cn(classes.alert, classes[`${alert.level}Container`])}
        key={alert.type}
      >
        <AutoHide data={alert} delay={alert.closeAfter} onHide={onHide}>
          <div className={classes.body}>
            <div className={classes.content}>{this.renderContent(alert)}</div>
            {alert.isClosable && (
              <IconButton className={classes.close} onClick={this.onHide}>
                <Icon name="close" />
              </IconButton>
            )}
          </div>
        </AutoHide>
      </div>
    )
  }
}
