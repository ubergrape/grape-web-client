import { normal, bigger } from 'grape-theme/dist/fonts'
import { blue, grayDark, grayBlueDark, red } from 'grape-theme/dist/base-colors'
import { borderLight } from 'grape-theme/dist/web-colors'
import getColoredIcon from 'grape-web/lib/svg-icons/getColored'

import { settingsButtonSize } from './constants'
import linkButton from '../../button/link'
import buttonIcon from '../../button/icon'
import { spacing } from '../constants'

export const styles = () => ({
  roomInfo: {
    display: 'block',
    flexDirection: 'column',
    height: '100%',
    color: grayBlueDark,
  },
  groupName: {
    extend: bigger,
    width: '100%',
    color: grayDark,
  },
  mainSettings: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    margin: spacing,
    marginBottom: 0,
  },
  additionalActions: {
    display: 'flex',
    flexShrink: 0,
    '& > *': {
      isolate: false,
      marginLeft: 10,
    },
  },
  notificationsButtonInherit: {
    ...buttonIcon('bell', {
      color: grayDark,
      iconOnly: true,
      size: settingsButtonSize,
    }),
    display: 'flex',
    '&:hover:before': {
      isolate: false,
      backgroundSize: 'contain',
      content: '""',
      width: settingsButtonSize,
      height: settingsButtonSize,
      cursor: 'pointer',
      backgroundRepeat: 'no-repeat',
      backgroundImage: ({ colors }) =>
        `url('${getColoredIcon({
          name: 'bell',
          color: `${colors.button || blue}`,
        })}')`,
      backgroundPosition: '50% 50%',
    },
  },
  notificationsButtonOff: {
    ...buttonIcon('bellMuted', {
      color: grayDark,
      iconOnly: true,
      size: settingsButtonSize,
    }),
    display: 'flex',
    '&:hover:before': {
      isolate: false,
      backgroundSize: 'contain',
      content: '""',
      width: settingsButtonSize,
      height: settingsButtonSize,
      cursor: 'pointer',
      backgroundRepeat: 'no-repeat',
      backgroundImage: ({ colors }) =>
        `url('${getColoredIcon({
          name: 'bellMuted',
          color: `${colors.button || blue}`,
        })}')`,
      backgroundPosition: '50% 50%',
    },
  },
  notificationsButtonCustom: {
    ...buttonIcon('bellCustom', {
      color: grayDark,
      iconOnly: true,
      size: settingsButtonSize,
    }),
    display: 'flex',
    '&:hover:before': {
      isolate: false,
      backgroundSize: 'contain',
      content: '""',
      width: settingsButtonSize,
      height: settingsButtonSize,
      cursor: 'pointer',
      backgroundRepeat: 'no-repeat',
      backgroundImage: ({ colors }) =>
        `url('${getColoredIcon({
          name: 'bellCustom',
          color: `${colors.button || blue}`,
        })}')`,
      backgroundPosition: '50% 50%',
    },
  },
  settingsButton: {
    ...buttonIcon('cog', {
      color: grayDark,
      iconOnly: true,
      size: settingsButtonSize,
    }),
    display: 'flex',
    '&:hover:before': {
      isolate: false,
      backgroundSize: 'contain',
      content: '""',
      width: settingsButtonSize,
      height: settingsButtonSize,
      cursor: 'pointer',
      backgroundRepeat: 'no-repeat',
      backgroundImage: ({ colors }) =>
        `url('${getColoredIcon({
          name: 'cog',
          color: `${colors.button || blue}`,
        })}')`,
      backgroundPosition: '50% 50%',
    },
  },
  additionalActionsDropdown: {},
  additionalActionButton: {
    extend: [linkButton, normal],
    display: 'block',
    whiteSpace: 'nowrap',
    width: '100%',
    textAlign: 'left',
    padding: 10,
    borderBottom: [1, 'solid', borderLight],
    '&:hover': {
      isolate: false,
      padding: 10,
      cursor: 'pointer',
      lineHeight: 1.5,
      borderBottom: [1, 'solid', borderLight],
      color: ({ colors }) => colors.button || red,
      textDecoration: 'underline',
    },
  },
  deleteRoomButton: {
    color: red,
  },
  settingsWrapper: {
    flexShrink: 0,
  },
  description: {
    padding: spacing,
    paddingTop: 0,
  },
})
