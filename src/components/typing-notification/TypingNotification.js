import React, {Component, PropTypes} from 'react'
import shallowCompare from 'react-addons-shallow-compare'

import TypingUsers from './TypingUsers'

/**
 * Typing notification container.
 */
export default class TypingNotification extends Component {
  static propTypes = {
    cleanupTyping: PropTypes.func.isRequired,
    channels: PropTypes.object.isRequired,
    channel: PropTypes.object.isRequired
  }

  componentDidMount() {
    this.intervalId = setInterval(::this.cleanup, 1000)
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  }

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
