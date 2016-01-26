import colors from 'grape-theme/dist/base-colors'
import fonts from 'grape-theme/dist/fonts'

const iconsWidth = 110

export default {
  wrapper: {
    ...fonts.normal,
    position: 'relative',
    width: '100%',
    height: '100%',
    minHeight: 38,
    boxSizing: 'border-box',
    paddingRight: iconsWidth
  },
  common: {
    overflow: 'hidden',
    minHeight: 38,
    boxSizing: 'border-box',
    padding: '14px 1px',
    textRendering: 'auto'
  },
  textarea: {
    ...fonts.normal,
    position: 'relative',
    zIndex: 1,
    display: 'block',
    width: '100%',
    height: '100%',
    outline: 'none',
    background: 'transparent',
    border: 'none',
    color: colors.black,
    resize: 'none'
  },
  highlighter: {
    position: 'absolute',
    left: '0',
    top: '0',
    right: iconsWidth,
    whiteSpace: 'pre-wrap',
    wordWrap: 'break-word',
    color: 'transparent'
  },
  token: {
    position: 'relative',
    boxSizing: 'border-box',
    margin: '0 -1px',
    padding: '2px 0',
    borderRadius: 3
  },
  // TODO: this copy/paste to be refactored after token design will be ready
  room: {
    border: '1px solid #e2c8f0',
    background: 'linear-gradient(0deg, #e2c8f0, #e6d0f2)'
  },
  user: {
    border: '1px solid #75c7e5',
    background: 'linear-gradient(0deg, #75c7e5, #83d3f0)'
  },
  search: {
    border: '1px solid #b8e7aa',
    background: 'linear-gradient(0deg, #b8e7aa, #c3ebb7)'
  },
  emoji: {
    border: '1px solid #fbd6d6',
    background: 'linear-gradient(0deg, #fbd6d6, #fbdddd)'
  }
}
