import theme from '../../../../constants/theme'

export default {
  tab: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  hint: {
    flexShrink: 0,
    color: theme.colorTextHint,
    fontSize: theme.fontSizeStandardWeb,
  },
  button: {
    width: 166,
    height: 32,
    color: theme.colorTextHint,
    fontSize: theme.fontSizeStandardWeb,
    borderRadius: theme.borderRadiusButtonPillWeb,
    border: `1px solid ${theme.colorBorderButton}`,
    textAlign: 'center',
    marginTop: 15,
    flexShrink: 0,
  },
  input: {
    marginTop: 24,
    flexShrink: 0,
  },
  list: {
    height: '100%',
    marginTop: 25,
  },
}
