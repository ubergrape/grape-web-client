export const isAllOff = ({ desktop, push }) =>
  push === 'off' && desktop === 'off'

export const isAllInherit = ({ desktop, push }) =>
  push === 'inherit' && desktop === 'inherit'

export const values = ['inherit', 'all', 'anyMention', 'directMention', 'off']
