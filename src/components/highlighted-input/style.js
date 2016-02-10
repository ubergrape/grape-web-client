import fonts from 'grape-theme/dist/fonts'


export default {
  container: {
    ...fonts.normal,
    position: 'relative',
    boxSizing: 'border-box'
  },
  highlighter: {
    position: 'absolute',
    overflow: 'hidden',
    left: 0,
    top: 0,
    right: 0,
    color: 'transparent',
    textRendering: 'auto'
  },
  token: {
    position: 'relative',
    boxSizing: 'border-box',
    margin: '0 -1px',
    padding: '2px 0',
    borderRadius: 3
  },
  editable: {
    position: 'relative',
    zIndex: 1,
    fontFamily: 'inherit',
    display: 'block',
    width: '100%',
    height: '100%',
    background: 'transparent',
    textRendering: 'auto'
  }
}
