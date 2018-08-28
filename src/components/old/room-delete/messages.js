import { defineMessages } from 'react-intl'

export default defineMessages({
  title: {
    id: 'roomDeleteDialogTitle',
    defaultMessage: 'Delete "{roomName}"?',
    description: 'Room Delete Dialog: dialog title',
  },
  provideName: {
    id: 'roomDeleteDialogProvideName',
    defaultMessage: 'Please enter the name of the room you want to delete.',
    description: 'Room Delete Dialog: validation message',
  },
  notMatchingName: {
    id: 'roomDeleteDialogNotMatchingName',
    defaultMessage: "Room name doesn't match",
    description: 'Room Delete Dialog: validation message',
  },
  inputPlaceholder: {
    id: 'roomDeleteDialoginputPlaceholder',
    defaultMessage: 'Confirm room name...',
    description: "Room Delete Dialog: input's placeholder",
  },
})
