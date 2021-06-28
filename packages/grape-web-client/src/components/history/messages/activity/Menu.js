import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'

import conf from '../../../../conf'
import { Menu as BaseMenu } from '../../../message-parts'

const handlerMap = {
  copyLink: 'onCopyLink',
  quote: 'onQuote',
  remove: 'onRemove',
}

const baseItems = ['copyLink', 'quote']

export default class Menu extends PureComponent {
  static propTypes = {
    channel: PropTypes.shape({
      // Is null in some cases.
      creator: PropTypes.number,
    }).isRequired,
    user: PropTypes.shape({
      role: PropTypes.number.isRequired,
    }).isRequired,
    permissions: PropTypes.object.isRequired,
    getContentNode: PropTypes.func.isRequired,
    /* eslint-disable react/no-unused-prop-types */
    onCopyLink: PropTypes.func.isRequired,
    onQuote: PropTypes.func.isRequired,
    onRemove: PropTypes.func.isRequired,
    parent: PropTypes.object.isRequired,
    style: PropTypes.object.isRequired,
    scrollTop: PropTypes.number.isRequired,
  }

  onSelectMenuItem = ({ name }) => {
    const cb = handlerMap[name]
    this.props[cb]()
  }

  render() {
    const {
      user,
      parent,
      style,
      scrollTop,
      channel,
      permissions,
      getContentNode,
    } = this.props
    const items = [...baseItems]

    if (
      user.role >= conf.constants.roles.ROLE_ADMIN ||
      channel.creator === user.id ||
      permissions.canDeleteAnyMessage
    ) {
      items.push('remove')
    }

    return (
      <BaseMenu
        onSelect={this.onSelectMenuItem}
        getContentNode={getContentNode}
        items={items}
        parent={parent}
        style={style}
        scrollTop={scrollTop}
      />
    )
  }
}
