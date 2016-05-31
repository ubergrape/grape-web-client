import fonts from 'grape-theme/dist/fonts'
import colors from 'grape-theme/dist/base-colors'
import webColors from 'grape-theme/dist/web-colors'

import buttonReset from '../button/reset'

const buttonBorderWidth = 1

const iconSettingsButton = {
  ...buttonReset,
  display: 'block',
  marginRight: 10,
  padding: 4,
  borderRadius: '50%',
  border: `${buttonBorderWidth}px solid`
}

const chooserButton = {
  ...buttonReset,
  display: 'block',
  overflow: 'hidden',
  boxSizing: 'border-box',
  width: 32,
  height: 32,
  borderRadius: '50%',
  backgroundClip: 'content-box',
  border: '1px solid transparent',
  boxShadow: `inset 0 0 0 2px ${colors.white}`,
  '&:hover': {
    borderColor: webColors.link
  }
}

export default {
  iconSettingsButton: {
    ...iconSettingsButton,
    borderColor: 'transparent',
    '&:hover': {
      borderColor: webColors.link
    }
  },
  iconSettingsButtonActive: {
    ...iconSettingsButton,
    borderColor: webColors.link
  },
  iconSettings: {
    boxSizing: 'border-box',
    padding: 15,
    paddingRight: 10
  },
  iconSettingsTitle: {
    ...fonts.small,
    fontWeight: 'bold'
  },
  roomColors: {
    marginTop: 20
  },
  iconSettingsItem: {
    display: 'inline-block',
    width: 32,
    height: 32,
    margin: '0 5px 5px 0',
    '&::last-child': {
      marginRight: 0
    }
  },
  chooserButton: {
    ...chooserButton,
    borderColor: webColors.borderDefault
  },
  chooserButtonActive: {
    ...chooserButton,
    borderColor: webColors.link
  },
  iconSettingsList: {
    marginTop: 10
  },
  icon: {
    transform: `translate(-${buttonBorderWidth}px, -${buttonBorderWidth}px)`
  }
}
