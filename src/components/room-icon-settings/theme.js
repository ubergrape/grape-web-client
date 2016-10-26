import {small} from 'grape-theme/dist/fonts'
import {white} from 'grape-theme/dist/base-colors'
import {
  link as linkColor,
  borderDefault as borderColor
} from 'grape-theme/dist/web-colors'

import buttonReset from '../button/reset'

export const iconSize = 60

export const previewIconSize = 32

const buttonBorderWidth = 1

const iconSettingsButton = {
  extend: buttonReset,
  display: 'block',
  marginRight: 10,
  padding: 4,
  borderRadius: '50%',
  border: `${buttonBorderWidth}px solid`
}

const chooserButton = {
  extend: buttonReset,
  display: 'block',
  overflow: 'hidden',
  boxSizing: 'border-box',
  width: previewIconSize,
  height: previewIconSize,
  borderRadius: '50%',
  backgroundClip: 'content-box',
  border: '1px solid transparent',
  boxShadow: `inset 0 0 0 2px ${white}`,
  '&:hover': {
    isolate: false,
    borderColor: linkColor
  }
}

export const styles = {
  iconSettingsButton: {
    extend: iconSettingsButton,
    borderColor: 'transparent',
    '&:hover': {
      isolate: false,
      borderColor: linkColor
    }
  },
  iconSettingsButtonActive: {
    extend: iconSettingsButton,
    borderColor: linkColor
  },
  iconSettings: {
    boxSizing: 'border-box',
    padding: 15,
    paddingRight: 10
  },
  iconSettingsTitle: {
    extend: small,
    fontWeight: 'bold'
  },
  roomColors: {
    marginTop: 20
  },
  iconSettingsItem: {
    display: 'inline-block',
    width: previewIconSize,
    height: previewIconSize,
    margin: '0 5px 5px 0',
    '&:last-child': {
      marginRight: 0
    }
  },
  chooserButton: {
    extend: chooserButton,
    borderColor: borderColor
  },
  chooserButtonActive: {
    extend: chooserButton,
    borderColor: linkColor
  },
  iconSettingsList: {
    marginTop: 10
  },
  icon: {
    transform: `translate(-${buttonBorderWidth}px, -${buttonBorderWidth}px)`
  }
}
