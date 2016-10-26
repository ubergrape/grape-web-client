import {grayBlueLighter, grayLight, green} from 'grape-theme/dist/base-colors'
import {smaller, normal} from 'grape-theme/dist/fonts'

import createInlineIcon from '../inline-icon/create'
import buttonPrimary from '../button/primary'
import buttonLink from '../button/link'
import inlineLink from '../button/inlineLink'

const padding = 15

const createIcon = name => createInlineIcon(name, {
  // FIXME: replace with theme colors.
  color: '#4d4d4d',
  size: normal.fontSize
})

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
  iconColumn: {
    display: 'inline-block',
    width: 22
  },
  titleIconMuteAll: createIcon('bellSlashOpen'),
  titleIconDesktop: createIcon('laptop'),
  titleIconPush: createIcon('mobile'),
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
      content: '"✓"'
    }
  },
  statusHidden: {
    opacity: 0,
    transition: 'opacity 300ms ease-in-out'
  },
  buttonLink,
  inlineLink,
  label: {
    extend: normal,
    cursor: 'pointer'
  },
  select: {
    // Chrome on windows creates an optical margin when text is too large.
    display: 'block',
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
