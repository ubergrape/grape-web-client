import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'

import { Menu as BaseMenu } from '../../../message-parts'

const handlerMap = {
  copyLink: 'onCopyLink',
  quote: 'onQuote',
  remove: 'onRemove',
}

export default class Menu extends PureComponent {
  static propTypes = {
    orgPermissions: PropTypes.object.isRequired,
    permissions: PropTypes.object.isRequired,
    getContentNode: PropTypes.func.isRequired,
    /* eslint-disable react/no-unused-prop-types */
    onCopyLink: PropTypes.func.isRequired,
    onQuote: PropTypes.func.isRequired,
    onRemove: PropTypes.func.isRequired,
  }

  onSelectMenuItem = ({ name }) => {
    const cb = handlerMap[name]
    this.props[cb]()
  }

  render() {
    const { permissions, orgPermissions, getContentNode } = this.props

    const items = ['copyLink']
    if (permissions.canQuoteMessage) items.push('quote')
    if (orgPermissions.canDeleteAnyMessage || permissions.canDeleteMessage) {
      items.push('remove')
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
