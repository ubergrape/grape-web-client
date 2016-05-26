import buton from '../button/default'
import buttonLink from '../button/link'
import buttonPrimary from '../button/primary'
import fonts from 'grape-theme/dist/fonts'
import {borderDark, borderDefault} from 'grape-theme/dist/web-colors'

const {padding} = buton

export default {
  footer: {
    paddingTop: 15,
    borderTop: `1px solid ${borderDefault}`,
    display: 'flex',
    justifyContent: 'space-between'
  },
  roomSettingsButton: {
    ...buttonLink,
    fontSize: fonts.small.fontSize,
    lineHeight: '28px',
    padding,
    paddingTop: 0,
    paddingBottom: 0,
    border: `1px solid ${borderDark}`,
    borderRadius: buttonPrimary.borderRadius
  },
  createButton: {
    ...buttonPrimary,
    '&:disabled': {
      opacity: 0.5,
      pointerEvents: 'none'
    }
  },
  settings: {
    position: 'relative'
  }
}
