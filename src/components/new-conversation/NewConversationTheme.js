import theme from '../../constants/theme'

export default {
  /*
    Styles for dialog window starts
    http://edenspiekermann.github.io/a11y-dialog/#usage
  */
  base: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: 5,
  },
  element: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'white',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  document: {
    minWidth: 680,
  },
  closeButton: {
    isolate: false,
    position: 'absolute',
    width: 35,
    height: 35,
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
    fontWeight: 600,
  },
  // Styles for dialog window ends
  description: {
    marginTop: 20,
    color: theme.grayDarkest,
    fontSize: theme.fontSizeOverlineMobile,
    lineHeight: '23px',
  },
  tabs: {
    marginTop: 25,
    width: '100%',
  },
}
