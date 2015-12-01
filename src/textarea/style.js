import colors from 'grape-theme/dist/base-colors'
import fonts from 'grape-theme/dist/fonts'

console.log(fonts)

export default {
  wrapper: {
    position: 'relative',
    width: '100%',
    height: '100%',
    minHeight: 38
  },

  common: {
    font: fonts.normal.fontSize + '/' + fonts.normal.lineHeight +  ' Arial, Helvetica, sans-serif',
    overflow: 'hidden',
    minHeight: 38,
    width: '100%',
    'box-sizing': 'border-box',
    'padding': 15
  },

  textarea: {
    position: 'relative',
    'z-index': 1,
    height: '100%',
    outline: 'none',
    background: 'transparent',
    border: 'none',
    outline: 0,
    color: colors.grapeDark,
    resize: 'none'
  },

  highlighter: {
    position: 'absolute',
    left: '0',
    top: '0',
    'white-space': 'pre-wrap',
    'word-wrap': 'break-word',
    color: 'transparent'
  },

  token: {
    'box-sizing': 'border-box',
    padding: '2px 0',
    background: colors.aquaLight,
    'box-shadow': '0 0 0 1px ' + colors.aquaDark,
    'border-radius': 3
  }
}
