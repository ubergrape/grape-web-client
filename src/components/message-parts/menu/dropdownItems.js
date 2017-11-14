import React from 'react'
import {FormattedMessage} from 'react-intl'

import Item from './DropdownItem'

export const EditMessage = ({onClick}) => (
  <Item
    onClick={onClick}
    icon="pencil"
  >
    <FormattedMessage
      id="editMessage"
      defaultMessage="Edit message"
      description="Dropdown menu with additional actions for message"
    />
  </Item>
)

export const CopyMessageLink = ({onClick}) => (
  <Item
    onClick={onClick}
    icon="link"
  >
    <FormattedMessage
      id="copyMessageLink"
      defaultMessage="Copy link to message"
      description="Dropdown menu with additional actions for message"
    />
  </Item>
)

export const PinMessage = ({onClick}) => (
  <Item
    icon="pin"
    onClick={onClick}
  >
    <FormattedMessage
      id="pinMessage"
      defaultMessage="Pin message"
      description="Dropdown menu with additional actions for message"
    />
  </Item>
)

export const DeleteMessage = ({onClick}) => (
  <Item
    onClick={onClick}
    icon="deleteMessage"
  >
    <FormattedMessage
      id="deleteMessage"
      defaultMessage="Delete message"
      description="Dropdown menu with additional actions for message"
    />
  </Item>
)
