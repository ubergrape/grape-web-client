import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { FormattedMessage } from 'react-intl'
import moment from 'moment'
import injectSheet from 'grape-web/lib/jss'
import noop from 'lodash/noop'
import Button from 'grape-web/lib/components/button'

@injectSheet({
  reconnectionAlert: {
    color: 'inherit',
    font: 'inherit',
    display: 'flex',
    justifyContent: 'space-between',
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
          id="reconnectingAlert"
          defaultMessage="Lost connection to the server — trying to reconnect."
        />
        <div>
          {secondsLeftToReconnect ? (
            <div>
              <FormattedMessage
                id="reconnectIn"
                defaultMessage="Reconnect in "
              />
              {secondsLeftToReconnect}
              <FormattedMessage id="reconnectSeconds" defaultMessage="s... " />
              <Button className={buttonClass} onClick={this.onReconnect}>
                <FormattedMessage
                  id="reconnectNow"
                  defaultMessage="Reconnect now"
                />
              </Button>
            </div>
          ) : (
            <FormattedMessage
              id="reconnecting"
              defaultMessage="Reconnecting..."
            />
          )}
        </div>
      </div>
    )
  }
}
