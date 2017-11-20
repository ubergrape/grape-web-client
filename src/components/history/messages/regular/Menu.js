import React, {PureComponent} from 'react'
import PropTypes from 'prop-types'

import {Menu as BaseMenu} from '../../../message-parts'

const menuHandlerMap = {
  copyLink: 'onCopyLink',
  remove: 'onRemove',
  edit: 'onEdit',
  quote: 'onQuote',
  pin: 'onPin',
  unpin: 'onUnpin'
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
    /* eslint-enable react/no-unused-prop-types */
    getContentNode: PropTypes.func.isRequired,
    isOwn: PropTypes.bool.isRequired,
    isPinned: PropTypes.bool.isRequired,
    hasAttachments: PropTypes.bool.isRequired,
    state: PropTypes.string
  }

  static defaultProps = {
    isPinned: false,
    state: undefined
  }

  onSelectMenuItem = ({name}) => {
    const cb = menuHandlerMap[name]
    this.props[cb]()
  }

  render() {
    const {
      isOwn, isPinned, hasAttachments, state, getContentNode
    } = this.props

    if (state === 'pending' || state === 'unsent') return null

    const items = []

    const edit = isOwn && !hasAttachments
    const remove = isOwn
    const quote = !hasAttachments

    if (edit) items.push('edit')
    if (remove) items.push('remove')
    items.push('copyLink')
    if (quote) items.push('quote')

    return (
      <BaseMenu
        onSelect={this.onSelectMenuItem}
        getContentNode={getContentNode}
        items={items}
        isPinned={isPinned}
        edit={edit}
        remove={remove}
        quote={quote}
      />
    )
  }
}
