import React from 'react'
import {FormattedMessage} from 'react-intl'

import Item from './MenuListItem'

export const EditMessage = props => (
  <Item
    onClick={props.onClick}
    icon="pencil"
  >
    <FormattedMessage
      id="editMessage"
      defaultMessage="Edit message"
      description="Dropdown menu with additional actions for message"
    />
  </Item>
)

export const CopyMessageLink = props => (
  <Item
    onClick={props.onClick}
    icon="link"
  >
    <FormattedMessage
      id="copyMessageLink"
      defaultMessage="Copy link to message"
      description="Dropdown menu with additional actions for message"
    />
  </Item>
)

export const PinMessage = () => (
  <Item
    icon="pin"
  >
    <FormattedMessage
      id="pinMessage"
      defaultMessage="Pin message"
      description="Dropdown menu with additional actions for message"
    />
  </Item>
)

export const DeleteMessage = props => (
  <Item
    onClick={props.onClick}
    icon="bin"
  >
    <FormattedMessage
      id="deleteMessage"
      defaultMessage="Delete message"
      description="Dropdown menu with additional actions for message"
    />
  </Item>
)
