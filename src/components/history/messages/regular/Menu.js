import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

import { Menu as BaseMenu } from '../../../message-parts'

const menuHandlerMap = {
  copyLink: 'onCopyLink',
  remove: 'onRemove',
  edit: 'onEdit',
  quote: 'onQuote',
  pin: 'onPin',
  unpin: 'onUnpin',
  more: 'onToggleDropdown',
}

export default class Menu extends PureComponent {
  static propTypes = {
    /* eslint-disable react/no-unused-prop-types */
    onCopyLink: PropTypes.func.isRequired,
    onRemove: PropTypes.func.isRequired,
    onEdit: PropTypes.func.isRequired,
    onQuote: PropTypes.func.isRequired,
    onPin: PropTypes.func.isRequired,
    onUnpin: PropTypes.func.isRequired,
    onToggleDropdown: PropTypes.func.isRequired,
    /* eslint-enable react/no-unused-prop-types */
    getContentNode: PropTypes.func.isRequired,
    isOwn: PropTypes.bool,
    isPinned: PropTypes.bool,
    isDropdownOpened: PropTypes.bool,
    hasAttachments: PropTypes.bool,
    state: PropTypes.string,
  }

  static defaultProps = {
    isOwn: false,
    isPinned: false,
    isDropdownOpened: false,
    hasAttachments: false,
    state: undefined,
  }

  onSelectMenuItem = ({ name }) => {
    const cb = menuHandlerMap[name]
    // Always close the dropdown once item was clicked.
    if (name !== 'more') this.props.onToggleDropdown(false)
    this.props[cb]()
  }

  render() {
    const {
      isOwn,
      isPinned,
      hasAttachments,
      state,
      getContentNode,
      isDropdownOpened,
    } = this.props

    if (state === 'pending' || state === 'unsent') return null

    const items = []

    if (isOwn && !hasAttachments) items.push('edit')
    if (isOwn) items.push('remove')
    items.push('copyLink', 'quote', 'pin')

    return (
      <BaseMenu
        onSelect={this.onSelectMenuItem}
        getContentNode={getContentNode}
        items={items}
        isPinned={isPinned}
        isDropdownOpened={isDropdownOpened}
        showDropdown={items.length > 2}
      />
    )
  }
}
