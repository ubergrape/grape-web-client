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
    updateTimer: PropTypes.func,
    buttonClass: PropTypes.string,
  }

  static defaultProps = {
    onReconnect: noop,
    updateTimer: noop,
    buttonClass: undefined,
  }

  componentDidMount = () => {
    const {
      reconnect: { timerSet, backoff },
      updateTimer,
    } = this.props
    this.timer = setInterval(() => {
      updateTimer(timerSet + backoff - Date.now())
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

    const secondsLeftToReconnect = parseInt(
      (reconnect.timerSet + reconnect.backoff - Date.now()) / 1000,
      10,
    )

    if (!secondsLeftToReconnect) return null

    return (
      <div className={classes.reconnectionAlert}>
        <FormattedMessage
          id="connectionTrouble"
          defaultMessage="We're having trouble connecting to Grape."
        />
        &nbsp;
        {secondsLeftToReconnect ? (
          <span>
            <FormattedMessage
              id="tryToReconnect"
              defaultMessage="We'll try to reconnect in"
            />
            &nbsp;
            {secondsLeftToReconnect}{' '}
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
            defaultMessage="Trying to reconnect ..."
          />
        )}
      </div>
    )
  }
}