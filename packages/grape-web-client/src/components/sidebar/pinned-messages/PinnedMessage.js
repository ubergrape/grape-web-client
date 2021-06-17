import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'

import Message from '../Message'
import { Menu } from '../../message-parts'

export default class PinnedMessage extends PureComponent {
  static propTypes = {
    message: PropTypes.shape({
      id: PropTypes.string.isRequired,
      channel: PropTypes.shape({
        id: PropTypes.number.isRequired,
      }).isRequired,
    }).isRequired,
    onUnpin: PropTypes.func.isRequired,
  }

  state = { isMenuOpened: false }

  onUnpin = () => {
    const {
      message: { id, channel },
      onUnpin,
    } = this.props
    onUnpin({ messageId: id, channelId: channel.id })
  }

  onRefContent = ref => {
    this.content = ref
  }

  onMouseEnter = () => {
    this.setState({ isMenuOpened: true })
  }

  onMouseLeave = () => {
    this.setState({ isMenuOpened: false })
  }

  getContentNode = () => this.content

  renderMenu = () => {
    if (!this.state.isMenuOpened) return null

    return (
      <Menu
        onSelect={this.onUnpin}
        getContentNode={this.getContentNode}
        items={['unpin']}
        isPinned
      />
    )
  }

  render() {
    return (
      <Message
        {...this.props}
        renderMenu={this.renderMenu}
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}
        onRefContent={this.onRefContent}
      />
    )
  }
}
