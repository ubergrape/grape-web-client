import {normal} from 'grape-theme/dist/fonts'

export default {
  container: {
    display: 'block',
    extend: normal,
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
    extend: normal,
    display: 'inline',
    position: 'relative',
    boxSizing: 'border-box',
    borderRadius: 3,
    padding: 1,
    marginLeft: -1,
    marginRight: -1
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
