import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { FormattedMessage } from 'react-intl'
import injectSheet from 'grape-web/lib/jss'
import noop from 'lodash/noop'
import Button from 'grape-web/lib/components/button'
import cn from 'classnames'

@injectSheet({
  notificationAlert: {
    color: 'inherit',
    font: 'inherit',
  },
})
export default class NotificationsAlert extends PureComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    onEnableNotifications: PropTypes.func,
    onHide: PropTypes.func,
    buttonClass: PropTypes.string,
  }

  static defaultProps = {
    onEnableNotifications: noop,
    onHide: noop,
    buttonClass: undefined,
  }

  onEnableNotifications = () => {
    const { onHide, onEnableNotifications } = this.props
    onEnableNotifications()
    onHide()
  }

  render() {
    const { classes, buttonClass } = this.props

    return (
      <div className={classes.notificationAlert}>
        <FormattedMessage id="initialGreeting" defaultMessage="Hey there!" />
        &nbsp;
        <FormattedMessage
          id="enableNotificationsRequest"
          defaultMessage="Please enable desktop notifications"
        />
        &nbsp;
        <FormattedMessage
          id="notificationsExplanation"
          defaultMessage="so your team members can reach you on {product}."
          values={{ product: __PRODUCT_NAME__ }}
        />
        &nbsp;
        <Button
          className={cn(buttonClass)}
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
