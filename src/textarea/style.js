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
    'box-sizing': 'border-box'
  },

  textarea: {
    width: '100%',
    height: '100%',
    outline: 'none',
    padding: 0,
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
    'z-index': '-1',
    'white-space': 'pre',
    'word-wrap': 'break-word',
    color: '#ccc'
  },

  token: {
    padding: '3px 0',
    background: colors.aquaLight,
    border: '1px solid ' + colors.aquaDark,
    'border-radius': 3
  }
}
