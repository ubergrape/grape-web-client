import theme from '../../../../constants/theme'

export default {
  button: {
    isolate: false,
    display: 'flex',
    alignItems: 'center',
    background: 'none',
    border: 0,
  },
  checkbox: {
    width: 24,
    minWidth: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
    display: 'flex',
    backgroundColor: ({ checked }) =>
      checked ? theme.colorIconActive : theme.colorBackgroundButtonLightActive,
  },
  name: {
    color: theme.colorTextBase,
    fontSize: theme.fontSizeLabelWeb,
    whiteSpace: 'nowrap',
    display: 'flex',
    alignItems: 'center',
  },
  description: {
    color: theme.colorTextHint,
    fontSize: theme.fontSizeLabelWeb,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: 'inline',
  },
}
