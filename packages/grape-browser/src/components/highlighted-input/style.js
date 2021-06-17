import fonts from 'grape-theme/dist/fonts'
import { grayBase } from 'grape-theme/dist/base-colors'

export default {
  container: {
    display: 'block',
    position: 'relative',
    boxSizing: 'border-box',
  },
  highlighter: {
    position: 'absolute',
    overflow: 'hidden',
    left: 0,
    top: 0,
    right: 0,
    color: 'transparent',
    textRendering: 'auto',
  },
  token: {
    extend: fonts.normal,
    display: 'inline',
    position: 'relative',
    boxSizing: 'border-box',
    borderRadius: 3,
    padding: 1,
    marginLeft: -1,
    marginRight: -1,
    color: 'transparent',
  },
  editable: {
    position: 'relative',
    zIndex: 1,
    fontFamily: 'inherit',
    display: 'block',
    width: '100%',
    height: '100%',
    background: 'transparent',
    textRendering: 'auto',
    wordBreak: 'break-word',
  },
  limited: {
    position: 'relative',
    zIndex: 1,
    width: '100%',
    height: '100%',
    background: 'transparent',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: grayBase,
  },
}
