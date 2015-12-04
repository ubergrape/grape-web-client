import colors from 'grape-theme/dist/base-colors'
import fonts from 'grape-theme/dist/fonts'

const ICONS_SPACE = 65

export default {
  wrapper: {
    position: 'relative',
    width: '100%',
    height: '100%',
    minHeight: 38,
    'box-sizing': 'border-box',
    'padding-right': ICONS_SPACE
  },

  common: {
    font: fonts.normal.fontSize + '/' + fonts.normal.lineHeight + ' Arial, Helvetica, sans-serif',
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
