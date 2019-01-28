import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { FormattedMessage } from 'react-intl'
import moment from 'moment'
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
    this.timer = setInterval(() => {
      this.props.updateTimer()
    }, 1000)
  }

  onReconnect = () => {
    const { onReconnect } = this.props
    onReconnect()
  }

  componentDidUnmount = () => {
    window.clearInterval(this.timer)
  }

  render() {
    const { classes, buttonClass, reconnect } = this.props

    const secondsLeftToReconnect = moment
      .duration(
        parseInt(reconnect.currentTime + reconnect.backoff - Date.now(), 10),
      )
      .seconds()

    return (
      <div className={classes.reconnectionAlert}>
        <FormattedMessage
          id="connectionTrouble"
          defaultMessage="We're having trouble connecting to Grape."
        />&nbsp;
        {secondsLeftToReconnect ? (
          <span>
            <FormattedMessage
              id="tryToReconnect"
              defaultMessage="We'll try to reconnect in"
            />&nbsp;
            {secondsLeftToReconnect}{' '}
            <FormattedMessage
              id="reconnectSeconds"
              defaultMessage="s, or you can"
            />&nbsp;
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
