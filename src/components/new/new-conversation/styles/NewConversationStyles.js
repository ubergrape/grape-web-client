import theme from '../../../../constants/theme'
import { zIndex } from '../../../../utils/z-index'

export default {
  /*
    Styles for dialog window starts
    http://edenspiekermann.github.io/a11y-dialog/#usage
  */
  base: {
    '&[data-a11y-dialog-native] > :first-child': {
      isolate: false,
      display: 'none',
    },
  },
  element: {
    position: 'absolute',
    zIndex: zIndex('dialog'),
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: theme.colorBackgroundNeutral,
    justifyContent: 'center',
    alignItems: 'center',
    '&[open]': {
      isolate: false,
      display: 'flex',
    },
  },
  document: {
    display: 'flex',
    flexDirection: 'column',
    minWidth: 680,
    maxWidth: 680,
    height: '80%',
  },
  closeButton: {
    isolate: false,
    position: 'absolute',
    width: 40,
    height: 40,
    padding: [0, 0, 4, 0],
    right: 24,
    top: 24,
    border: 0,
    color: theme.colorIconBaseStandardWeb,
    fontSize: 28,
    cursor: 'pointer',
  },
  title: {
    color: theme.grayDarkest,
    fontSize: theme.fontSizeHeadingPageWeb,
    lineHeight: '27px',
    fontWeight: theme.fontWeightEmphasis,
  },
  // Styles for dialog window ends
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  description: {
    marginTop: 20,
    color: theme.grayDarkest,
    fontSize: theme.fontSizeOverlineMobile,
    lineHeight: '23px',
  },
  tabs: {
    display: 'flex',
    flexDirection: 'column',
    marginTop: 25,
    width: '100%',
    height: '100%',
  },
}
