import PropTypes from 'prop-types'
import React, {PureComponent} from 'react'
import {FormattedMessage} from 'react-intl'
import injectSheet from 'grape-web/lib/jss'
import noop from 'lodash/utility/noop'
import Button from 'material-ui/Button'

@injectSheet({
  notificationAlert: {
    color: 'inherit'
  }
})
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
      <div className={classes.notificationAlert}>
        <FormattedMessage
          id="initialGreeting"
          defaultMessage="Hey there!"
        />
        {' '}
        <FormattedMessage
          id="enableNotificationsRequest"
          defaultMessage="Please enable desktop notifications"
        />
        {' '}
        <FormattedMessage
          id="notificationsExplanation"
          defaultMessage="so your team members can reach you on Grape."
        />
        <Button
          className={`${classes.actionButton} ${classes[`${alert.level}Button`]}`}
          onClick={this.onEnableNotifications}
        >
          <FormattedMessage
            id="enableNotifications"
            defaultMessage="Enable notifications"
          />
        </Button>
      </div>
    )
  }
}
