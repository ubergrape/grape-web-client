import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'

import animationInterval from '../../../utils/animation-interval'
import TypingUsers from './TypingUsers'

/**
 * Typing notification container.
 */
export default class TypingNotification extends PureComponent {
  static propTypes = {
    cleanupTyping: PropTypes.func.isRequired,
    channels: PropTypes.object.isRequired,
    channel: PropTypes.object.isRequired,
    className: PropTypes.string,
  }

  static defaultProps = {
    className: null,
  }

  componentDidMount() {
    this.controller = new AbortController()
    animationInterval(1000, this.controller.signal, () => {
      this.cleanup()
    })
  }

  componentWillUnmount() {
    this.controller.abort()
  }

  cleanup = () => {
    const { cleanupTyping, channels } = this.props
    cleanupTyping(channels)
  }

  render() {
    const { channels, channel, className } = this.props

    if (!channel || !channels[channel.id]) return null

    return (
      <div className={className}>
        <TypingUsers users={channels[channel.id]} />
      </div>
    )
  }
}
