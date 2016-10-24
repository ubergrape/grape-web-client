import {grayBlueLighter, grayLight, green} from 'grape-theme/dist/base-colors'
import {smaller, normal} from 'grape-theme/dist/fonts'

import buttonPrimary from '../button/primary'
import inlineLink from '../button/inlineLink'

const padding = 15

export const styles = {
  notificationSettings: {
    borderTop: `3px solid ${grayBlueLighter}`
  },
  section: {
    paddingTop: padding,
    paddingBottom: padding,
    borderBottom: `1px solid ${grayBlueLighter}`
  },
  setting: {
    paddingLeft: padding,
    paddingRight: padding
  },
  groupedSetting: {
    extend: 'setting',
    paddingBottom: padding,
    '&:last-child': {
      paddingBottom: 0
    }
  },
  titleHeadline: {
    extend: normal,
    fontWeight: 'bold',
    display: 'inline-block'
  },
  status: {
    display: 'inline-block',
    color: green,
    opacity: 1,
    marginLeft: 10,
    '&:after': {
      content: '"\\2713"'
    }
  },
  statusHidden: {
    opacity: 0,
    transition: 'opacity 300ms ease-in-out'
  },
  inlineLink,
  label: {
    extend: normal,
    cursor: 'pointer'
  },
  checkbox: {
    marginRight: padding
  },
  select: {
    width: '50%'
  },
  allMutedHint: {
    extend: normal,
    fontWeight: 'thin',
    color: grayLight,
    marginTop: padding
  },
  footer: {
    display: 'flex',
    alignItems: 'center',
    padding
  },
  hint: {
    extend: smaller,
    flex: 1
  },
  done: {
    extend: buttonPrimary,
    marginLeft: padding
  }
}
