import PropTypes from 'prop-types'
import React, {PureComponent} from 'react'
import {FormattedMessage} from 'react-intl'

import Tooltip from '../tooltip/HoverTooltip'

function getMessage(name) {
  switch (name) {
    case 'edit':
      return (
        <FormattedMessage
          id="editMessage"
          defaultMessage="Edit message"
        />
      )
    case 'copyLink':
      return (
        <FormattedMessage
          id="copyLink"
          defaultMessage="Copy link to message"
        />
      )
    case 'remove':
      return (
        <FormattedMessage
          id="deleteMessage"
          defaultMessage="Delete message"
        />
      )
    case 'removeLinkAttachment':
      return (
        <FormattedMessage
          id="deleteLinkAttachment"
          defaultMessage="Delete attachment"
        />
      )
    case 'quote':
      return (
        <FormattedMessage
          id="quoteMessage"
          defaultMessage="Quote message"
        />
      )
    default:
  }

  return null
}

function getItemClassName(classes, name, index, total) {
  const classNames = [classes[`${name}Item`], classes.item]

  if (total === 1) {
    classNames.push(classes.singleItem)
  } else {
    if (index === 0) {
      classNames.push(classes.firstItem)
      if (total === 2) classNames.push(classes.nextToLastItem)
    }
    if (index === total - 1) classNames.push(classes.lastItem)
  }

  return classNames.join(' ')
}

export default class MenuItem extends PureComponent {
  static propTypes = {
    onSelect: PropTypes.func.isRequired,
    name: PropTypes.string.isRequired,
    classes: PropTypes.object.isRequired,
    index: PropTypes.number.isRequired,
    total: PropTypes.number.isRequired
  }

  onSelect = () => {
    const {onSelect, name} = this.props
    onSelect({name})
  }

  render() {
    const {name, classes, index, total} = this.props
    return (
      <Tooltip
        key={name}
        placement="top"
        message={getMessage(name)}
        inline
      >
        <span
          className={getItemClassName(classes, name, index, total)}
          onClick={this.onSelect}
        />
      </Tooltip>
    )
  }
}
