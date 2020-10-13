import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { FormattedMessage } from 'react-intl'
import injectSheet from 'grape-web/lib/jss'
import noop from 'lodash/noop'
import cn from 'classnames'
import Button from 'grape-web/lib/components/button'

@injectSheet({
  reconnectionAlert: {
    color: 'inherit',
    font: 'inherit',
  },
  reconnectButton: {
    minWidth: 'auto',
  },
})
export default class ReconnectionAlert extends PureComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    reconnect: PropTypes.object.isRequired,
    onReconnect: PropTypes.func,
    updateReconnectTimer: PropTypes.func,
    buttonClass: PropTypes.string,
  }

  static defaultProps = {
    onReconnect: noop,
    updateReconnectTimer: noop,
    buttonClass: undefined,
  }

  componentDidMount = () => {
    this.timer = setInterval(() => {
      this.props.updateReconnectTimer()
    }, 1000)
  }

  componentWillUnmount = () => {
    window.clearInterval(this.timer)
  }

  onReconnect = () => {
    const { onReconnect } = this.props
    onReconnect()
  }

  render() {
    const { classes, buttonClass, reconnect } = this.props
    const { backoff, reconnecting } = reconnect

    return (
      <div className={classes.reconnectionAlert}>
        <FormattedMessage
          id="connectionTrouble"
          defaultMessage="We're having trouble connecting to {product}."
          values={{ product: __PRODUCT_NAME__ }}
        />
        &nbsp;
        {backoff > 0 && !reconnecting ? (
          <span>
            <FormattedMessage
              id="tryToReconnect"
              defaultMessage="We'll try to reconnect in"
            />
            &nbsp;
            {backoff}{' '}
            <FormattedMessage
              id="reconnectSeconds"
              defaultMessage="s, or you can"
            />
            &nbsp;
            <Button
              className={cn(buttonClass, classes.reconnectButton)}
              onClick={this.onReconnect}
            >
              <FormattedMessage id="reconnectNow" defaultMessage="try it now" />
            </Button>
          </span>
        ) : (
          <FormattedMessage
            id="tryingToReconnect"
            defaultMessage="Trying to reconnect…"
          />
        )}
      </div>
    )
  }
}
