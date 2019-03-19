import { small } from 'grape-theme/dist/fonts'
import { white } from 'grape-theme/dist/base-colors'
import {
  link as linkColor,
  borderDefault as borderColor,
} from 'grape-theme/dist/web-colors'
import { icon as iconSize } from 'grape-theme/dist/sizes'
import buttonReset from '../button/reset'

const buttonBorderWidth = 1

export const styles = {
  iconSettingsButtonBase: {
    extend: buttonReset,
    display: 'block',
    marginRight: 10,
    padding: 4,
    borderRadius: '50%',
    border: [buttonBorderWidth, 'solid'],
  },
  iconSettingsButton: {
    composes: '$iconSettingsButtonBase',
    borderColor: 'transparent',
    '&:hover > *': {
      isolate: false,
      display: 'flex',
      borderRadius: '50%',
      position: 'relative',
      cursor: ({ allowEdit }) => (allowEdit ? 'pointer' : 'default'),
    },
    '&:hover': {
      isolate: false,
      marginRight: 10,
      padding: 4,
      borderRadius: '50%',
      position: 'relative',
      border: [buttonBorderWidth, 'solid'],
      borderColor: ({ colors, allowEdit }) =>
        allowEdit ? colors.button || linkColor : 'transparent',
    },
  },
  iconSettingsButtonActive: {
    composes: '$iconSettingsButtonBase',
    borderColor: ({ colors }) => colors.button || linkColor,
  },
  iconSettings: {
    padding: 15,
    paddingRight: 10,
  },
  iconSettingsTitle: {
    extend: small,
    display: 'block',
    fontWeight: 'bold',
  },
  roomColors: {
    marginTop: 20,
  },
  iconSettingsItem: {
    display: 'inline-block',
    margin: [0, 5, 5, 0],
    '&:last-child': {
      isolate: false,
      marginRight: 0,
    },
  },
  chooserButtonBase: {
    extend: buttonReset,
    display: 'block',
    overflow: 'hidden',
    width: iconSize.xl,
    height: iconSize.xl,
    borderRadius: '50%',
    backgroundClip: 'content-box',
    border: [1, 'solid', 'transparent'],
    boxShadow: `inset 0 0 0 2px ${white}`,
    cursor: 'pointer',
    '&:hover': {
      isolate: false,
      borderColor: ({ colors }) => colors.button || linkColor,
      '&, & *': {
        isolate: false,
        cursor: 'pointer',
      },
    },
  },
  chooserButton: {
    composes: '$chooserButtonBase',
    borderColor: ({ colors }) => colors.button || borderColor,
  },
  chooserButtonActive: {
    composes: '$chooserButtonBase',
    borderColor: ({ colors }) => colors.button || linkColor,
  },
  iconSettingsList: {
    marginTop: 10,
  },
  icon: {
    transform: `translate(-${buttonBorderWidth}px, -${buttonBorderWidth}px)`,
  },
}
