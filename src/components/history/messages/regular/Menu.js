import React, {PureComponent} from 'react'

import {Menu as BaseMenu} from '../../../message-parts'

const menuHandlerMap = {
  copyLink: 'onCopyLink',
  remove: 'onRemove',
  edit: 'onEdit',
  quote: 'onQuote',
  pin: 'onPin'
}

export default class Menu extends PureComponent {
  onSelectMenuItem = ({name}) => {
    const cb = menuHandlerMap[name]
    this.props[cb]()
  }

  render() {
    const {isOwn, attachments, state, getContentNode} = this.props

    if (state === 'pending' || state === 'unsent') return null

    const items = ['more']
    const hasAttachments = attachments.length !== 0

    if (isOwn) {
      items.unshift('remove')
      // Attachments can't be edited.
      if (!hasAttachments) items.unshift('edit')
    } else if (!hasAttachments) {
      items.unshift('quote')
    }

    return (
      <BaseMenu
        onSelect={this.onSelectMenuItem}
        getContentNode={getContentNode}
        items={items}
      />
    )
  }
}
