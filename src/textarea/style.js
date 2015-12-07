import colors from 'grape-theme/dist/base-colors'
import fonts from 'grape-theme/dist/fonts'

const ICONS_SPACE = 65
const fontFamily = 'Arial, Helvetica, sans-serif'

export default {
  wrapper: {
    font: fonts.normal.fontSize + '/' + fonts.normal.lineHeight + ' ' + fontFamily,
    position: 'relative',
    width: '100%',
    height: '100%',
    minHeight: 38,
    'box-sizing': 'border-box',
    'padding-right': ICONS_SPACE
  },

  common: {
    overflow: 'hidden',
    minHeight: 38,
    'box-sizing': 'border-box',
    'padding': 9
  },

  textarea: {
    position: 'relative',
    'z-index': 1,
    width: '100%',
    height: '100%',
    outline: 'none',
    background: 'transparent',
    border: 'none',
    color: colors.grapeDark,
    resize: 'none'
  },

  highlighter: {
    position: 'absolute',
    left: '0',
    top: '0',
    right: ICONS_SPACE,
    'white-space': 'pre-wrap',
    'word-wrap': 'break-word',
    color: 'red'
  },

  token: {
    'box-sizing': 'border-box',
    padding: '2px 0',
    background: 'linear-gradient(0deg, ' + colors.aquaDark + ',' + colors.aquaLight + ')',
    // 'box-shadow': '0 0 0 1px ' + colors.grassDark,
    'border-radius': 3
  }
}
