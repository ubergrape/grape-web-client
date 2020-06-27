import { defineMessages } from 'react-intl'

export default defineMessages({
  title: {
    id: 'groupDeleteDialogTitle',
    defaultMessage: 'Delete "{groupName}"?',
    description: 'Group Delete Dialog: dialog title',
  },
  provideName: {
    id: 'groupDeleteDialogProvideName',
    defaultMessage: 'Please enter the name of the group you want to delete.',
    description: 'Group Delete Dialog: validation message',
  },
  notMatchingName: {
    id: 'groupDeleteDialogNotMatchingName',
    defaultMessage: "Group name doesn't match",
    description: 'Group Delete Dialog: validation message',
  },
  inputPlaceholder: {
    id: 'groupDeleteDialoginputPlaceholder',
    defaultMessage: 'Confirm group name…',
    description: "Group Delete Dialog: input's placeholder",
  },
})
