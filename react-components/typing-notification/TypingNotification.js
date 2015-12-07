import React, {Component, PropTypes} from 'react'
import {shouldPureComponentUpdate} from 'react-pure-render'

import TypingUsers from './TypingUsers'

/**
 * Typing notification container.
 */
export default class TypingNotification extends Component {
  static propTypes = {
    cleanupTyping: PropTypes.func,
    channels: PropTypes.object,
    channel: PropTypes.object
  }

  componentDidMount() {
    this.intervalId = setInterval(::this.cleanup, 1000)
  }

  shouldComponentUpdate = shouldPureComponentUpdate

  componentWillUnmount() {
    clearInterval(this.intervalId)
  }

  cleanup() {
    this.props.cleanupTyping(this.props.channels)
  }

  render() {
    const {channels, channel} = this.props
    if (!channel || !channels[channel.id]) return null
    return <TypingUsers users={channels[channel.id]}/>
  }
}
