import theme from '../../../../constants/theme'

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
    display: 'flex',
    flexDirection: 'column',
    minWidth: 680,
    maxWidth: 680,
    height: '80%',
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
    fontWeight: theme.fontWeightEmphasis,
  },
  // Styles for dialog window ends
  content: {
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
