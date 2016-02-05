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
  highlighter: {
    position: 'absolute',
    left: 0,
    top: 0,
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
  }
}
