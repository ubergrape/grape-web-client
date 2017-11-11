import React, {PureComponent} from 'react'

import BaseMenu from '../../../message-parts/Menu'

const menuHandlerMap = {
  copyLink: 'onCopyLink',
  remove: 'onRemove',
  more: 'toggleMoreOptionsDropdown',
  edit: 'onEdit',
  quote: 'onQuote'
}

export default class Menu extends PureComponent {
  onSelectMenuItem = ({name}) => {
    const cb = menuHandlerMap[name]
    this.props[cb]()
  }

  render() {
    const {isOwn, attachments, state, getContentNode,
      onEdit, onRemove, onCopyLink, showMoreOptionsDropdown} = this.props

    if (state === 'pending' || state === 'unsent') return null

    const items = ['more']
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
        onEdit={onEdit}
        onRemove={onRemove}
        onCopyLink={onCopyLink}
        showMoreOptionsDropdown={showMoreOptionsDropdown}
      />
    )
  }
}
