import colors from 'grape-theme/dist/base-colors'
import fonts from 'grape-theme/dist/fonts'

console.log(fonts)

export default {
  wrapper: {
    position: 'relative',
    width: '100%',
    height: '100%'
  },

  common: {
    font: fonts.normal.fontSize + '/' + fonts.normal.lineHeight +  ' Arial, Helvetica, sans-serif',
    width: '100%',
    height: '100%',
    padding: 20,
    'box-sizing': 'border-box'
  },

  textarea: {
    display: 'block',
    outline: 'none',
    minHeight: 38,
    background: 'transparent',
    border: 'none',
    outline: 0,
    color: colors.grapeDark
  },

  highlighter: {
    position: 'absolute',
    left: '0',
    top: '0',
    'z-index': '-1',
    color: 'transparent'
  },

  token: {
    padding: '3px 0',
    background: colors.aquaLight,
    border: '1px solid ' + colors.aquaDark,
    'border-radius': 3
  }
}
