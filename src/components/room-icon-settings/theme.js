import {small} from 'grape-theme/dist/fonts'
import {white} from 'grape-theme/dist/base-colors'
import {
  link as linkColor,
  borderDefault as borderColor
} from 'grape-theme/dist/web-colors'
import {icon as iconSize} from 'grape-theme/dist/sizes'
import buttonReset from '../button/reset'

const buttonBorderWidth = 1

const iconSettingsButton = {
  extend: buttonReset,
  display: 'block',
  marginRight: 10,
  padding: 4,
  borderRadius: '50%',
  border: [buttonBorderWidth, 'solid'],
  '&:hover, &:hover *': {
    isolate: false,
    cursor: 'pointer'
  }
}

const chooserButton = {
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
    borderColor: linkColor,
    '&, & *': {
      isolate: false,
      cursor: 'pointer'
    }
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
    padding: 15,
    paddingRight: 10
  },
  iconSettingsTitle: {
    display: 'block',
    extend: small,
    fontWeight: 'bold'
  },
  roomColors: {
    marginTop: 20
  },
  iconSettingsItem: {
    display: 'inline-block',
    width: iconSize.l,
    height: iconSize.l,
    margin: '0 5px 5px 0',
    '&:last-child': {
      marginRight: 0
    }
  },
  chooserButton: {
    extend: chooserButton,
    borderColor
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
