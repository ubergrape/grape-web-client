import {grayBlueLighter, grayLight, green} from 'grape-theme/dist/base-colors'
import {small, normal} from 'grape-theme/dist/fonts'

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
  titleContainer: {
    display: 'flex',
    width: '50%'
  },
  titleHeadline: {
    extend: normal,
    flex: 1,
    fontWeight: 'bold'
  },
  status: {
    color: green,
    opacity: 1,
    '&:after': {
      content: '" \\2713"'
    }
  },
  statusHidden: {
    opacity: 0,
    transition: 'opacity 1s ease-in-out'
  },
  inlineLink,
  label: {
    extend: normal,
    cursor: 'pointer'
  },
  checkbox: {
    marginRight: 10
  },
  select: {
    width: '50%'
  },
  footer: {
    extend: small,
    padding
  },
  allMutedHint: {
    extend: normal,
    fontWeight: 'thin',
    color: grayLight,
    marginTop: 20
  }
}
