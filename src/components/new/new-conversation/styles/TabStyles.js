import theme from '../../../../constants/theme'

export default {
  tab: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  buttonWrapper: {
    flexShrink: 0,
    marginTop: 15,
  },
  hint: {
    flexShrink: 0,
    color: theme.colorTextHint,
    fontSize: theme.fontSizeStandardWeb,
  },
  title: {
    fontSize: theme.fontSizeHeadingStandardWeb,
    fontWeight: theme.fontWeightEmphasis,
    lineHeight: '21px',
    marginTop: 20,
  },
  text: {
    lineHeight: '23px',
    marginTop: 8,
  },
  input: {
    flexShrink: 0,
    marginTop: 24,
  },
  list: {
    height: '100%',
    marginTop: 25,
  },
}
