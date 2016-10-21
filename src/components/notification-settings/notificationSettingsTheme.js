import {grayBlueLighter, grayLight} from 'grape-theme/dist/base-colors'
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
  h3: {
    extend: normal,
    fontWeight: 'bold'
  },
  inlineLink,
  label: {
    extend: normal,
    cursor: 'pointer'
  },
  checkbox: {
    marginRight: 10
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
