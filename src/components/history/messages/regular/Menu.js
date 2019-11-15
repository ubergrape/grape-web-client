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
    orgPermissions: PropTypes.object.isRequired,
    permissions: PropTypes.object.isRequired,
    isPinned: PropTypes.bool,
    isDropdownOpened: PropTypes.bool,
    isLinkAttachments: PropTypes.bool,
    state: PropTypes.string,
  }

  static defaultProps = {
    isPinned: false,
    isDropdownOpened: false,
    isLinkAttachments: false,
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
      orgPermissions,
      permissions,
      isPinned,
      state,
      getContentNode,
      isDropdownOpened,
      isLinkAttachments,
    } = this.props

    if (state === 'pending' || state === 'unsent') return null

    const items = []
    if (!isLinkAttachments && permissions.canUpdateMessage) {
      items.push('edit')
    }
    if (orgPermissions.canDeleteAnyMessage || permissions.canDeleteMessage) {
      items.push('remove')
    }
    items.push('copyLink')
    if (!isLinkAttachments && permissions.canQuoteMessage) items.push('quote')
    if (!isLinkAttachments && permissions.canPinMessage) items.push('pin')

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
