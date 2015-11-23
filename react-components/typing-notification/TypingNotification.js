import React, {Component} from 'react'
import {shouldPureComponentUpdate} from 'react-pure-render'

import TypingUsers from './TypingUsers'

/**
 * Typing notification container.
 */
export default class TypingNotification extends Component {
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
