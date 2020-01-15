import theme from '../../../../constants/theme'

export default {
  wrapper: {
    marginTop: 25,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  buttonWrapper: {
    isolate: false,
    display: 'flex',
    alignItems: 'center',
    marginBottom: 25,
  },
  button: {
    isolate: false,
    display: 'flex',
    alignItems: 'center',
    background: 'none',
    border: 0,
    padding: 5,
    height: 32,
    cursor: 'pointer',
  },
  buttonText: {
    marginLeft: 8,
    fontSize: theme.fontSizeButtonWeb,
    fontWeight: theme.fontWeightEmphasis,
    pointerEvents: 'none',
  },
  main: {
    overflowY: 'auto',
    width: '100%',
    marginTop: 25,
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    '&:not(:first-child)': {
      isolate: false,
      marginTop: 25,
    },
  },
  label: {
    color: theme.colorTextBase,
    fontSize: theme.fontSizeLabelWeb,
    fontWeight: theme.fontWeightEmphasis,
  },
  content: {
    position: 'relative',
    marginTop: 4,
  },
  list: {
    marginTop: 12,
    height: ({ users }) => (users.length > 0 ? 96 : 20),
  },
  buttons: {
    display: 'flex',
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 30,
  },
  hint: {
    width: 620,
    color: theme.colorTextHint,
    fontSize: theme.fontSizeLabelWeb,
    marginTop: 4,
  },
  hintDark: {
    color: theme.colorTextBase,
    fontSize: theme.fontSizeLabelWeb,
    marginTop: 4,
  },
  hintLarge: {
    color: theme.colorTextBase,
  },
  hintLargeWrapper: {
    marginLeft: 8,
  },
  hintDarkLargeMargin: {
    color: theme.colorTextBase,
    fontSize: theme.fontSizeLabelWeb,
    marginTop: 16,
  },
  counter: {
    color: theme.colorTextActive,
    fontSize: theme.fontSizeLabelWeb,
  },
  highlight: {
    color: theme.colorTextBase,
    fontSize: theme.fontSizeLabelWeb,
    fontWeight: theme.fontWeightEmphasis,
  },
}
