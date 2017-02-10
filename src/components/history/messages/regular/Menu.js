import React, {PureComponent} from 'react'

import BaseMenu from '../../../message-parts/Menu'

const menuHandlerMap = {
  copyLink: 'onCopyLink',
  remove: 'onRemove',
  edit: 'onEdit',
  quote: 'onQuote'
}

export default class Menu extends PureComponent {
  onSelectMenuItem = ({name}) => {
    const cb = menuHandlerMap[name]
    this.props[cb]()
  }

  render() {
    const {isOwn, attachments, state, getContentNode} = this.props

    if (state === 'pending' || state === 'unsent') return null

    const items = ['copyLink']
    const hasAttachments = attachments.length !== 0

    if (isOwn) {
      // Attachments can't be edited.
      if (!hasAttachments) items.unshift('edit')
      items.push('remove')
    } else if (!hasAttachments) {
      items.push('quote')
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
