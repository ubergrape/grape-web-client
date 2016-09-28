import button from '../button/default'
import buttonLink from '../button/link'
import buttonPrimary from '../button/primary'
import {small, bigger} from 'grape-theme/dist/fonts'
import {borderDark, borderDefault} from 'grape-theme/dist/web-colors'
import {grayBlueLighter} from 'grape-theme/dist/base-colors'
import color from 'color'

const {padding} = button

export default {
  footer: {
    paddingTop: 15,
    borderTop: `1px solid ${borderDefault}`,
    display: 'flex',
    justifyContent: 'space-between'
  },
  roomSettingsButton: {
    extend: buttonLink,
    fontSize: small.fontSize,
    lineHeight: 2.2,
    padding,
    paddingTop: 0,
    paddingBottom: 0,
    border: `1px solid ${borderDark}`,
    borderRadius: buttonPrimary.borderRadius,
    cursor: 'pointer',
    '&:hover': {
      extend: buttonLink['&:hover'],
      fontSize: small.fontSize,
      lineHeight: 2.2
    }
  },
  createButton: {
    extend: buttonPrimary,
    '&:disabled': {
      isolate: false,
      opacity: 0.5,
      pointerEvents: 'none'
    }
  },
  settings: {
    display: 'flex',
    position: 'relative',
    alignItems: 'center',
    paddingBottom: 15,
    marginBottom: 15,
    borderBottom: `1px solid ${borderDefault}`
  },
  icon: {
    flexShrink: 1
  },
  name: {
    flexGrow: 1,
    marginRight: 10
  },
  nameInput: {
    extend: bigger,
    width: '100%',
    outline: 'none',
    padding: '1px 10px',
    borderRadius: 5,
    border: `1px solid ${color(grayBlueLighter).darken(0.05).hexString()}`
  }
}
