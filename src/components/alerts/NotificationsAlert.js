import PropTypes from 'prop-types'
import React, {PureComponent} from 'react'
import {FormattedMessage} from 'react-intl'
import injectSheet from 'grape-web/lib/jss'
import noop from 'lodash/utility/noop'

import {CloseLower as Close} from '../i18n/i18n'
import style from './alertStyle'

@injectSheet(style)
export default class NotificationsAlert extends PureComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    alert: PropTypes.object.isRequired,
    enableNotifications: PropTypes.func,
    hideAlert: PropTypes.func
  }

  static defaultProps = {
    enableNotifications: noop,
    hideAlert: noop
  }

  onEnableNotifications = () => {
    this.props.enableNotifications()
    this.onHide()
  }

  onHide = () => {
    const {alert, hideAlert} = this.props
    hideAlert(alert)
  }

  render() {
    const {alert, classes} = this.props

    return (
      <div className={classes.layout}>
        <div className={classes.mainCol}>
          <FormattedMessage
            id="initialGreeting"
            defaultMessage="Hey there!"
          />
          {' '}
          <button
            className={classes.buttonLink}
            onClick={this.onEnableNotifications}
          >
            <FormattedMessage
              id="enableNotificationsRequest"
              defaultMessage="Please enable desktop notifications"
            />
          </button>
          {' '}
          <FormattedMessage
            id="notificationsExplanation"
            defaultMessage="so your team members can reach you on Grape."
          />
        </div>
        <div className={classes.secondaryCol}>
          <button
            className={`${classes.actionButton} ${classes[`${alert.level}Button`]}`}
            onClick={this.onEnableNotifications}
          >
            <FormattedMessage
              id="enableNotifications"
              defaultMessage="Enable notifications"
            />
          </button>
        </div>
        <div className={classes.secondaryCol}>
          <button
            className={classes.buttonLink}
            onClick={this.onHide}
          >
            <Close />
          </button>
        </div>
      </div>
    )
  }
}
