import React, {Component} from 'react'
import {shouldPureComponentUpdate} from 'react-pure-render'

import TypingUsers from './TypingUsers'

/**
 * Typing notification container.
 */
export default class TypingNotification extends Component {
  componentDidMount() {
    this.intervalId = setInterval(this.props.cleanupTyping, 1000)
  }

  shouldComponentUpdate = shouldPureComponentUpdate

  componentWillUnmount() {
    clearInterval(this.intervalId)
  }

  render() {
    const {channels, channel} = this.props
    if (!channel || !channels[channel.id]) return null
    return <TypingUsers users={channels[channel.id]}/>
  }
}
