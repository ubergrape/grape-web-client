import theme from '../../../../constants/theme'

export default {
  tab: {
    flex: '1 1 0',
  },
  buttonLarge: {
    isolate: false,
    width: '100%',
    height: 35,
    background: 'none',
    border: 0,
    textAlign: 'center',
    fontSize: theme.fontSizeLargeWeb,
    cursor: 'pointer',
    borderBottom: `1px solid ${theme.colorBorderSeparator}`,
    color: theme.colorTextBase,
    '&:hover': {
      isolate: false,
      borderBottom: `1px solid ${theme.colorIconBaseHoverWeb}`,
    },
  },
  buttonActive: {
    isolate: false,
    borderBottom: `1px solid ${theme.colorTextActive}`,
    color: theme.colorTextActive,
    '&:hover': {
      isolate: false,
      borderBottom: `1px solid ${theme.colorTextActive}`,
      color: theme.colorTextActive,
    },
  },
}
